-- AlterTable
ALTER TABLE "FileScan" ADD COLUMN     "status" "ScanStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "scanId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "FileScan_status_idx" ON "FileScan"("status");
