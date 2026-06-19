import { NextResponse } from "next/server";

export function apiSuccess<T>(result: T, status = 200) {
  return NextResponse.json({ success: true, result }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}
