/*
  Warnings:

  - Made the column `resumeUrl` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `portfolio` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `github` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkedIn` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resumeUrl" SET NOT NULL,
ALTER COLUMN "portfolio" SET NOT NULL,
ALTER COLUMN "github" SET NOT NULL,
ALTER COLUMN "linkedIn" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
