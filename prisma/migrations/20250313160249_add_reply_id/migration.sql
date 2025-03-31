/*
  Warnings:

  - Added the required column `response_tweet_id` to the `query` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "query" ADD COLUMN     "response_tweet_id" TEXT NOT NULL;
