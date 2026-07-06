import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";

async function getParticipantByCode(code) {
  const clean = String(code || "").trim().toUpperCase();
  if (!clean) return null;

  const snap = await db.collection("participants").where("code", "==", clean).limit(1).get();
  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

function revealEnabled() {
  const reveal = process.env.NEXT_PUBLIC_REVEAL_DATETIME || "2026-07-23T16:45:00-03:00";
  return Date.now() >= new Date(reveal).getTime();
}

export async function POST(request) {
  try {
    const { code } = await request.json();
    const participant = await getParticipantByCode(code);

    if (!participant) {
      return NextResponse.json({ error: "Código inválido." }, { status: 401 });
    }

    if (!participant.assignedToId) {
      return NextResponse.json({ error: "El sorteo todavía no fue realizado." }, { status: 400 });
    }

    const cluesSnap = await db.collection("clues")
      .where("toId", "==", participant.id)
      .orderBy("createdAt", "asc")
      .get();

    const canReveal = revealEnabled();

    const clues = cluesSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        type: d.type || "Pista",
        text: d.text || "",
        fromName: canReveal ? (d.fromName || "") : ""
      };
    });

    return NextResponse.json({
      ok: true,
      participant: {
        id: participant.id,
        name: participant.name,
        assignedToId: participant.assignedToId,
        assignedToName: participant.assignedToName
      },
      secretFriendName: canReveal ? (participant.secretFriendName || "") : "",
      clues
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar datos." }, { status: 500 });
  }
}
