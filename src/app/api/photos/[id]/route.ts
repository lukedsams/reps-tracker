import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getUserData } from "@/lib/store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getUserData();
  const photo = data.photos.find((p) => p.id === id);

  if (!photo) { return NextResponse.json({ error: "Not found" }, { status: 404 }); }
  if (!process.env.BLOB_READ_WRITE_TOKEN) { return NextResponse.json({ error: "Photo storage not connected" }, { status: 503 }); }

  const result = await get(photo.pathname, { access: "private" });
  if (!result || result.statusCode !== 200) { return NextResponse.json({ error: "Not found" }, { status: 404 }); }

  return new NextResponse(result.stream as unknown as ReadableStream, { headers: { "Content-Type": photo.contentType || "image/jpeg", "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" } });
}
