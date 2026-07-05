import { db } from "../../../lib/firebaseAdmin";

export function checkAdmin(adminCode) {
  return Boolean(process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE);
}

export function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function getSummary() {
  const participantsSnap = await db.collection("participants").orderBy("name").get();
  const cluesSnap = await db.collection("clues").get();

  const clues = cluesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const rawParticipants = participantsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  const participants = rawParticipants.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    assignedToId: p.assignedToId || "",
    assignedToName: p.assignedToName || "",
    secretFriendId: p.secretFriendId || "",
    secretFriendName: p.secretFriendName || "",
    sentCount: clues.filter((c) => c.fromId === p.id).length,
    receivedCount: clues.filter((c) => c.toId === p.id).length
  }));

  const drawComplete = participants.length > 0 && participants.every(
    (p) => p.assignedToId && p.secretFriendId
  );

  return {
    participants,
    clues: clues.map((c) => ({
      id: c.id,
      type: c.type || "Pista",
      fromName: c.fromName || "",
      toName: c.toName || "",
      text: c.text || ""
    })),
    drawComplete
  };
}
