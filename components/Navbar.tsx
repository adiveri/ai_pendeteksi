"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">
          🍎 FruitDetect
        </Link>
        <div className="space-x-4">
          <Link href="/upload" className="hover:underline">
            Deteksi
          </Link>
          <Link href="/riwayat" className="hover:underline">
            Riwayat
          </Link>
        </div>
      </div>
    </nav>
  );
}