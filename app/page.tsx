import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Deteksi Kesegaran Buah & Sayur
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Unggah foto buah atau sayur Anda dan sistem kami akan langsung
        mengidentifikasi jenis serta kondisinya: sehat, sakit, mentah, matang,
        atau terlalu matang. Didukung oleh kecerdasan buatan.
      </p>
      <Link
        href="/upload"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        Mulai Deteksi
      </Link>
    </div>
  );
}