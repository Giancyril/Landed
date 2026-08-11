import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseResumeBuffer } from "@/lib/resume/parser";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customTitle = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 5MB" },
        { status: 400 }
      );
    }

    // Convert file to Node buffer for parsing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract text from PDF / DOCX
    const { text: extractedText } = await parseResumeBuffer(
      buffer,
      file.type,
      file.name
    );

    // 2. Upload file to Supabase Storage ('resumes' bucket)
    const storagePath = `resumes/${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (storageError) {
      console.warn("[Storage Upload Warning]", storageError);
      // Fallback: storage path string if storage bucket policy is missing
    }

    // 3. Check if user already has any primary resume
    const { data: existingResumes } = await supabase
      .from("resumes")
      .select("id")
      .eq("user_id", user.id);

    const isFirstResume = !existingResumes || existingResumes.length === 0;

    // 4. Save metadata record to Supabase Postgres
    const title = customTitle || file.name.replace(/\.[^/.]+$/, "");
    const { data: resume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        file_name: file.name,
        file_size: file.size,
        storage_path: storagePath,
        extracted_text: extractedText,
        is_primary: isFirstResume,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ resume }, { status: 201 });
  } catch (err: any) {
    console.error("[api/resume/upload] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload and parse resume" },
      { status: 500 }
    );
  }
}
