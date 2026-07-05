import { NextResponse } from "next/server";
import { db, FieldValue } from "../../../lib/firebaseAdmin";

async function getParticipantByCode(code) {
  const clean = String(code || "").trim().toUpperCase();
  if (!clean) return null;

  const snap = await db.collection("participants").where("code", "==", clean).limit(1).get();
  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function POST(request) {
  try {
    const { code, text, type } = await request.json();
    const participant = await getParticipantByCode(code);

    if (!participant) {
      return NextResponse.json({ error: "Código inválido." }, { status: 401 });
    }

    if (!participant.assignedToId) {
      return NextResponse.json({ error: "El sorteo todavía no fue realizado." }, { status: 400 });
    }

    const cleanText = String(text || "").trim();

    if (cleanText.length < 5) {
      return NextResponse.json({ error: "La pista es muy corta." }, { status: 400 });
    }

    if (cleanText.length > 300) {
      return NextResponse.json({ error: "La pista no puede superar 300 caracteres." }, { status: 400 });
    }

    await db.collection("clues").add({
      fromId: participant.id,
      fromName: participant.name,
      toId: participant.assignedToId,
      toName: participant.assignedToName,
      type: String(type || "Pista"),
      text: cleanText,
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al enviar la pista." }, { status: 500 });
  }
}
