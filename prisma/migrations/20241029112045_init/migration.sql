/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;
