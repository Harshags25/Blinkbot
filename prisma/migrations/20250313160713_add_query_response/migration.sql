/*
  Warnings:

  - The primary key for the `query` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `response` to the `query` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "query" DROP CONSTRAINT "query_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL,
ADD CONSTRAINT "query_pkey" PRIMARY KEY ("id");
