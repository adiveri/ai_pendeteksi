import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function HasilPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params.id;

  if (!id) {
    return <div className="p-6 text-center">Data hasil tidak ditemukan.</div>;
  }

  const data = await prisma.detection.findUnique({
    where: { id },
  });

  if (!data) {
    return <div className="p-6 text-center">Data hasil tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Hasil Deteksi
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={data.imageUrl}
            alt="Hasil deteksi"
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {data.fruitName}
          </h3>

          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {data.condition}
          </span>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Tingkat Keyakinan</p>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(data.confidence * 100).toFixed(0)}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {(data.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
