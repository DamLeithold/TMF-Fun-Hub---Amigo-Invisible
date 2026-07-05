import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { checkAdmin, shuffle, getSummary } from "../helpers";

export async function POST(request) {
  try {
    const { adminCode } = await request.json();

    if (!checkAdmin(adminCode)) {
      return NextResponse.json({ error: "Código administrador inválido." }, { status: 401 });
    }

    const snap = await db.collection("participants").get();
    const participants = snap.docs.map((doc) => ({
      id: doc.id,
      ref: doc.ref,
      ...doc.data()
    }));

    if (participants.length < 3) {
      return NextResponse.json({ error: "Cargá al menos 3 participantes." }, { status: 400 });
    }

    let assigned = shuffle(participants);
    let attempts = 0;

    while (participants.some((p, index) => p.id === assigned[index].id)) {
      assigned = shuffle(participants);
      attempts++;
      if (attempts > 3000) {
        return NextResponse.json({ error: "No se pudo generar sorteo válido." }, { status: 500 });
      }
    }

    const secretByReceiver = {};
    participants.forEach((giver, index) => {
      const receiver = assigned[index];
      secretByReceiver[receiver.id] = giver;
    });

    const batch = db.batch();

    participants.forEach((giver, index) => {
      const receiver = assigned[index];
      const secretFriend = secretByReceiver[giver.id];

      batch.update(giver.ref, {
        assignedToId: receiver.id,
        assignedToName: receiver.name,
        secretFriendId: secretFriend.id,
        secretFriendName: secretFriend.name
      });
    });

    const cluesSnap = await db.collection("clues").get();
    cluesSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    const summary = await getSummary();

    return NextResponse.json({
      ok: true,
      message: "Sorteo realizado correctamente.",
      ...summary
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al realizar sorteo." }, { status: 500 });
  }
}
