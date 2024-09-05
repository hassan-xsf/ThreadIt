/*
  Warnings:

  - The values [DownVote] on the enum `VoteType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId,postId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoteType_new" AS ENUM ('Upvote', 'Downvote');
ALTER TABLE "Vote" ALTER COLUMN "type" TYPE "VoteType_new" USING ("type"::text::"VoteType_new");
ALTER TYPE "VoteType" RENAME TO "VoteType_old";
ALTER TYPE "VoteType_new" RENAME TO "VoteType";
DROP TYPE "VoteType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_postId_commentId_key" ON "Vote"("userId", "postId", "commentId");
