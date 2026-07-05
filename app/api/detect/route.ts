import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyImage } from '@/lib/classifier';

// Konfigurasi validasi
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    // Validasi keberadaan file
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Tidak ada gambar yang diunggah' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Format file harus JPG, JPEG, atau PNG' },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5 MB' },
        { status: 400 }
      );
    }

    // Baca file sebagai buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Konversi buffer ke base64 data URL
    const ext = imageFile.type === 'image/png' ? 'png' : 'jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/${ext};base64,${base64}`;

    // Jalankan klasifikasi AI
    const prediction = await classifyImage(buffer);

    // Simpan ke database
    const detection = await prisma.detection.create({
      data: {
        imageUrl: dataUrl,               // simpan sebagai data URL
        fruitName: prediction.fruitName,
        condition: prediction.condition,
        confidence: prediction.confidence,
      },
    });

    // Kembalikan hasil
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