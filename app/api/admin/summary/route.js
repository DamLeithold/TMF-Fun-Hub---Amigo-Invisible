import { NextResponse } from "next/server";
import { checkAdmin, getSummary } from "../helpers";

export async function POST(request) {
  try {
    const { adminCode } = await request.json();

    if (!checkAdmin(adminCode)) {
      return NextResponse.json({ error: "Código administrador inválido." }, { status: 401 });
    }

    const summary = await getSummary();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar panel." }, { status: 500 });
  }
}
