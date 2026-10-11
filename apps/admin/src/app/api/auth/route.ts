import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // TODO: авторизация менеджера / суперадмина, выдача JWT в httpOnly cookie
  return NextResponse.json({ ok: true });
}
