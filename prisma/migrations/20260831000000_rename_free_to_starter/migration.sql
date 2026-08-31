-- Rename enum value free -> starter
ALTER TYPE "UserPlan" RENAME VALUE 'free' TO 'starter';

-- Update default on the column
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'starter'::"UserPlan";
