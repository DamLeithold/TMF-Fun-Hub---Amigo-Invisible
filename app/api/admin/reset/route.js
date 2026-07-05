import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { checkAdmin } from "../helpers";

export async function POST(request) {
  try {
    const { adminCode } = await request.json();

    if (!checkAdmin(adminCode)) {
      return NextResponse.json({ error: "Código administrador inválido." }, { status: 401 });
    }

    const participants = await db.collection("participants").get();
    const clues = await db.collection("clues").get();

    const batch = db.batch();
    participants.docs.forEach((doc) => batch.delete(doc.ref));
    clues.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({
      ok: true,
      message: "Todo fue reiniciado correctamente.",
      participants: [],
      clues: [],
      drawComplete: false
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al reiniciar." }, { status: 500 });
  }
}
