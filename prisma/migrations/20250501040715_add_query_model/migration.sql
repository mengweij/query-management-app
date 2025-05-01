-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "form_data" ADD CONSTRAINT "form_data_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "queries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "form_data_id" UUID NOT NULL,

    CONSTRAINT "queries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "queries_form_data_id_key" ON "queries"("form_data_id");

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_form_data_id_fkey" FOREIGN KEY ("form_data_id") REFERENCES "form_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
