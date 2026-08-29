import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// POST /api/upload/pdf — terima file PDF (multipart/form-data, field "file"),
// simpan ke Supabase Storage, kembalikan URL publiknya untuk disimpan di Writing.pdfUrl.
// PDF ini nantinya dibaca inline lewat <iframe> di halaman /tulisan/[slug], bukan diunduh.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File harus berformat PDF." }, { status: 400 });
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Ukuran PDF maksimal 20MB." }, { status: 400 });
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
    const safeName = `pdfs/pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;

    const supabase = createServiceRoleClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(safeName, file, { contentType: "application/pdf", cacheControl: "31536000" });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "Gagal mengunggah PDF." }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(safeName);

    return NextResponse.json({ data: { url: data.publicUrl } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah PDF." }, { status: 500 });
  }
}
