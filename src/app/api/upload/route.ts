import { NextResponse } from "next/server";
import { uploadBuffer, isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, "");

  if (isCloudinaryConfigured) {
    const result = await uploadBuffer(buffer, filename);
    return NextResponse.json({ url: result.secure_url });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return NextResponse.json({ url: `/uploads/${filename}`, local: true });
}
