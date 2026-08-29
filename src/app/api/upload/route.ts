import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// POST /api/upload — terima file gambar banner (multipart/form-data, field "file")
// dan simpan ke Supabase Storage, lalu kembalikan URL publiknya untuk disimpan di Project.bannerImage
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar." }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 5MB." }, { status: 400 });
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const safeName = `banners/banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createServiceRoleClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(safeName, file, { contentType: file.type, cacheControl: "31536000" });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(safeName);

    return NextResponse.json({ data: { url: data.publicUrl } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
  }
}
