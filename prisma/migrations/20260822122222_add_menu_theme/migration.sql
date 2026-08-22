-- CreateEnum
CREATE TYPE "MenuTheme" AS ENUM ('plate', 'bistro', 'fresh');

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "theme" "MenuTheme" NOT NULL DEFAULT 'plate';
