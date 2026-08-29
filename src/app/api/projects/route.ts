import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProjectInput } from "@/types";

// GET /api/projects — daftar semua proyek (dipakai admin), urut berdasarkan `order`
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data proyek." }, { status: 500 });
  }
}

// POST /api/projects — buat proyek baru
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProjectInput;

    if (!body.title?.trim() || !body.description?.trim() || !body.bannerImage?.trim()) {
      return NextResponse.json(
        { error: "Judul, deskripsi, dan gambar banner wajib diisi." },
        { status: 400 }
      );
    }

    const slugBase = body.slug?.trim() || slugify(body.title);
    let slug = slugBase;
    let suffix = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${suffix++}`;
    }

    const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        slug,
        subtitle: body.subtitle?.trim() || null,
        description: body.description.trim(),
        bannerImage: body.bannerImage.trim(),
        tags: body.tags?.trim() ?? "",
        liveUrl: body.liveUrl?.trim() || null,
        githubUrl: body.githubUrl?.trim() || null,
        figmaUrl: body.figmaUrl?.trim() || null,
        order: body.order ?? nextOrder,
        published: body.published ?? true
      }
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat proyek." }, { status: 500 });
  }
}
