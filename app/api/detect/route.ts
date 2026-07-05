import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyImage } from '@/lib/classifier';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Tidak ada gambar yang diunggah' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Format file harus JPG atau PNG' },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5 MB' },
        { status: 400 }
      );
    }

    // baca file langsung ke memory
    const buffer = Buffer.from(
      await imageFile.arrayBuffer()
    );

    // klasifikasi langsung dari buffer
    const prediction = await classifyImage(buffer);

    // ubah buffer jadi base64
    const imageBase64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    const detection = await prisma.detection.create({
      data: {
        imageUrl: imageBase64,
        fruitName: prediction.fruitName,
        condition: prediction.condition,
        confidence: prediction.confidence,
      },
    });

    return NextResponse.json({
      id: detection.id,
      fruitName: detection.fruitName,
      condition: detection.condition,
      confidence: detection.confidence,
      imageUrl: detection.imageUrl,
      createdAt: detection.createdAt,
    });

  } catch (error) {
    console.error('Detection error:', error);

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses gambar' },
      { status: 500 }
    );
  }
}