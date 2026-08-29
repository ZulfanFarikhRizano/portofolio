import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ReorderBody {
  order: { id: string; order: number }[];
}

// PATCH /api/writings/reorder — atur ulang urutan tampil daftar tulisan sekaligus
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as ReorderBody;

    if (!Array.isArray(body.order) || body.order.length === 0) {
      return NextResponse.json({ error: "Payload urutan tidak valid." }, { status: 400 });
    }

    await prisma.$transaction(
      body.order.map((item) =>
        prisma.writing.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    const updated = await prisma.writing.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengubah urutan tulisan." }, { status: 500 });
  }
}
