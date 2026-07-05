"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const conditionLabels: Record<string, string> = {
  SEHAT: "Sehat",
  SAKIT: "Sakit",
  MENTAH: "Mentah",
  MATANG: "Matang",
  TERLALU_MATANG: "Terlalu Matang",
};

const conditionColors: Record<string, string> = {
  SEHAT: "bg-green-100 text-green-800",
  SAKIT: "bg-red-100 text-red-800",
  MENTAH: "bg-yellow-100 text-yellow-800",
  MATANG: "bg-blue-100 text-blue-800",
  TERLALU_MATANG: "bg-orange-100 text-orange-800",
};

export default function HasilClient() {
  const searchParams = useSearchParams();

  const fruitName = searchParams.get("fruitName") || "Tidak diketahui";
  const condition = searchParams.get("condition") || "SEHAT";
  const confidence = parseFloat(searchParams.get("confidence") || "0");
  const imageUrl = searchParams.get("imageUrl") || "/placeholder.png";

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Hasil Deteksi
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={imageUrl}
            alt="Hasil deteksi"
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {fruitName}
          </h3>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              conditionColors[condition] || "bg-gray-100 text-gray-800"
            }`}
          >
            {conditionLabels[condition] || condition}
          </span>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Tingkat Keyakinan</p>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(confidence * 100).toFixed(0)}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/upload"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors"
        >
          Deteksi Lagi
        </Link>
        <Link
          href="/riwayat"
          className="border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-6 rounded-lg text-center transition-colors"
        >
          Lihat Riwayat
        </Link>
      </div>
    </div>
  );
}
