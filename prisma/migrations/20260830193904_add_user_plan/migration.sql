-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('free', 'pro', 'premium');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "UserPlan" NOT NULL DEFAULT 'free';
