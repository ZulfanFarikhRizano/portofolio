import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WritingInput } from "@/types";

interface Params {
  params: { id: string };
}

// GET /api/writings/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const writing = await prisma.writing.findUnique({ where: { id: params.id } });
    if (!writing) {
      return NextResponse.json({ error: "Tulisan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ data: writing });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil tulisan." }, { status: 500 });
  }
}

// PUT /api/writings/:id — update penuh/parsial (judul, isi, tag, tautan, tanggal, urutan, status)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = (await req.json()) as WritingInput;

    const existing = await prisma.writing.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Tulisan tidak ditemukan." }, { status: 404 });
    }

    if (body.slug && body.slug !== existing.slug) {
      const clash = await prisma.writing.findUnique({ where: { slug: body.slug } });
      if (clash) {
        return NextResponse.json({ error: "Slug sudah dipakai tulisan lain." }, { status: 409 });
      }
    }

    const writing = await prisma.writing.update({
      where: { id: params.id },
      data: {
        title: body.title?.trim() ?? existing.title,
        slug: body.slug?.trim() || existing.slug,
        excerpt: body.excerpt?.trim() ?? existing.excerpt,
        content: body.content !== undefined ? body.content?.trim() || null : existing.content,
        pdfUrl: body.pdfUrl !== undefined ? body.pdfUrl?.trim() || null : existing.pdfUrl,
        coverImage: body.coverImage !== undefined ? body.coverImage?.trim() || null : existing.coverImage,
        tags: body.tags?.trim() ?? existing.tags,
        externalUrl: body.externalUrl !== undefined ? body.externalUrl?.trim() || null : existing.externalUrl,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt,
        order: body.order ?? existing.order,
        published: body.published ?? existing.published
      }
    });

    return NextResponse.json({ data: writing });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memperbarui tulisan." }, { status: 500 });
  }
}

// DELETE /api/writings/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await prisma.writing.delete({ where: { id: params.id } });
    return NextResponse.json({ data: { id: params.id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus tulisan." }, { status: 500 });
  }
}
