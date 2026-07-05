import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { checkAdmin, generateCode, getSummary } from "../helpers";

export async function POST(request) {
  try {
    const { adminCode, names } = await request.json();

    if (!checkAdmin(adminCode)) {
      return NextResponse.json({ error: "Código administrador inválido." }, { status: 401 });
    }

    const cleanNames = [...new Set((names || []).map((n) => String(n).trim()).filter(Boolean))];

    if (cleanNames.length < 3) {
      return NextResponse.json({ error: "Cargá al menos 3 participantes." }, { status: 400 });
    }

    const oldParticipants = await db.collection("participants").get();
    const oldClues = await db.collection("clues").get();

    let batch = db.batch();
    oldParticipants.docs.forEach((doc) => batch.delete(doc.ref));
    oldClues.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    batch = db.batch();

    cleanNames.forEach((name) => {
      const ref = db.collection("participants").doc();
      batch.set(ref, {
        name,
        code: generateCode(),
        assignedToId: "",
        assignedToName: "",
        secretFriendId: "",
        secretFriendName: "",
        createdAt: new Date()
      });
    });

    await batch.commit();

    const summary = await getSummary();

    return NextResponse.json({
      ok: true,
      message: "Participantes guardados correctamente.",
      ...summary
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar participantes." }, { status: 500 });
  }
}
