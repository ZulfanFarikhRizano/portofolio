import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { WritingInput } from "@/types";

// GET /api/writings — daftar semua karya tulis (dipakai admin), urut berdasarkan `order`
export async function GET() {
  try {
    const writings = await prisma.writing.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json({ data: writings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data tulisan." }, { status: 500 });
  }
}

// POST /api/writings — buat karya tulis baru
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WritingInput;

    if (!body.title?.trim() || !body.excerpt?.trim()) {
      return NextResponse.json({ error: "Judul dan ringkasan wajib diisi." }, { status: 400 });
    }

    const slugBase = body.slug?.trim() || slugify(body.title);
    let slug = slugBase;
    let suffix = 1;
    while (await prisma.writing.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${suffix++}`;
    }

    const maxOrder = await prisma.writing.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const writing = await prisma.writing.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt.trim(),
        content: body.content?.trim() || null,
        pdfUrl: body.pdfUrl?.trim() || null,
        coverImage: body.coverImage?.trim() || null,
        tags: body.tags?.trim() ?? "",
        externalUrl: body.externalUrl?.trim() || null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        order: body.order ?? nextOrder,
        published: body.published ?? true
      }
    });

    return NextResponse.json({ data: writing }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat tulisan." }, { status: 500 });
  }
}
