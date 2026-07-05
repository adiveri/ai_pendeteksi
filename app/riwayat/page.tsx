"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface HistoryItem {
  id: string;
  fruitName: string | null;
  condition: string;
  confidence: number;
  imageUrl: string;
  createdAt: string;
}

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

export default function RiwayatPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error("Gagal memuat riwayat");
        const data = await res.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Riwayat Deteksi
      </h2>

      {loading && (
        <div className="text-center py-12 text-gray-500">Memuat data...</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Belum ada riwayat deteksi.{" "}
          <Link href="/upload" className="text-green-600 underline">
            Mulai deteksi
          </Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.fruitName || "Buah"}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">
                {item.fruitName || "Tidak diketahui"}
              </h3>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                  conditionColors[item.condition] || "bg-gray-100 text-gray-800"
                }`}
              >
                {conditionLabels[item.condition] || item.condition}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                Confidence: {(item.confidence * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}