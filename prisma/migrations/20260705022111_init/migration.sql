-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('SEHAT', 'SAKIT', 'MENTAH', 'MATANG', 'TERLALU_MATANG');

-- CreateTable
CREATE TABLE "Detection" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fruitName" TEXT,
    "condition" "Condition" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Detection_pkey" PRIMARY KEY ("id")
);
