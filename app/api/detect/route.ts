import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyImage } from '@/lib/classifier';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs'; // pastikan runtime Node.js (bukan edge)

// Konfigurasi
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
  try {
    // Pastikan direktori upload ada
    await mkdir(UPLOAD_DIR, { recursive: true });

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

    // Simpan file ke public/uploads dengan nama unik
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    await writeFile(filePath, buffer);

    // URL relatif yang bisa diakses publik
    const imageUrl = `/uploads/${uniqueName}`;

    // Jalankan klasifikasi AI
    const prediction = await classifyImage(buffer);

    // Simpan ke database
    const detection = await prisma.detection.create({
      data: {
        imageUrl,
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