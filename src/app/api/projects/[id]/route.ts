import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProjectInput } from "@/types";

interface Params {
  params: { id: string };
}

// GET /api/projects/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil proyek." }, { status: 500 });
  }
}

// PUT /api/projects/:id — update penuh (judul, teks, metadata, tautan, gambar, urutan)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = (await req.json()) as ProjectInput;

    const existing = await prisma.project.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
    }

    if (body.slug && body.slug !== existing.slug) {
      const clash = await prisma.project.findUnique({ where: { slug: body.slug } });
      if (clash) {
        return NextResponse.json({ error: "Slug sudah dipakai proyek lain." }, { status: 409 });
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: body.title?.trim() ?? existing.title,
        slug: body.slug?.trim() || existing.slug,
        subtitle: body.subtitle?.trim() ?? existing.subtitle,
        description: body.description?.trim() ?? existing.description,
        bannerImage: body.bannerImage?.trim() ?? existing.bannerImage,
        tags: body.tags?.trim() ?? existing.tags,
        liveUrl: body.liveUrl?.trim() || null,
        githubUrl: body.githubUrl?.trim() || null,
        figmaUrl: body.figmaUrl?.trim() || null,
        order: body.order ?? existing.order,
        published: body.published ?? existing.published
      }
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memperbarui proyek." }, { status: 500 });
  }
}

// DELETE /api/projects/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ data: { id: params.id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus proyek." }, { status: 500 });
  }
}
