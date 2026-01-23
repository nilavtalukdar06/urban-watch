import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      { message: "health check route is working" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "health check route is not working" },
      { status: 500 },
    );
  }
}
