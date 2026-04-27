import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const complianceId = formData.get("complianceId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File must be PDF, Word document, PNG, or JPEG" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }

  const supabase = await createClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `compliance/${currentUser.organizationId}/${complianceId ?? "new"}_${timestamp}_${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("compliance-docs")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Compliance bucket is private. Return a 1-hour signed URL for immediate
  // preview, and the storage path so the client can save the path (not the
  // ephemeral URL) to the compliance row. Subsequent renders generate fresh
  // signed URLs from that path on the server side.
  const { data: signed, error: signError } = await supabase.storage
    .from("compliance-docs")
    .createSignedUrl(path, 60 * 60);

  if (signError || !signed) {
    return NextResponse.json(
      { error: signError?.message ?? "Failed to sign URL." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: signed.signedUrl,
    path,
    fileName: file.name,
  });
}
