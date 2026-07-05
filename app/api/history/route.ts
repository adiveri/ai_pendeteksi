import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const history = await prisma.detection.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fruitName: true,
        condition: true,
        confidence: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil riwayat' },
      { status: 500 }
    );
  }
}