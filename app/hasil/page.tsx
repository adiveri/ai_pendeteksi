import { Suspense } from "react";
import HasilClient from "./HasilClient";

export default function HasilPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Memuat hasil...</div>}>
      <HasilClient />
    </Suspense>
  );
}
