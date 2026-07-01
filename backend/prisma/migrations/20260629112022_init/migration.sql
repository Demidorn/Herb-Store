-- CreateTable
CREATE TABLE "Herb" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "family" TEXT,
    "description" TEXT NOT NULL,
    "uses" JSONB NOT NULL,
    "growing" JSONB NOT NULL,
    "care" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Herb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT NOT NULL,
    "herbId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Herb_name_idx" ON "Herb"("name");

-- CreateIndex
CREATE INDEX "Herb_scientificName_idx" ON "Herb"("scientificName");

-- CreateIndex
CREATE INDEX "Herb_tags_idx" ON "Herb"("tags");

-- CreateIndex
CREATE INDEX "Image_herbId_idx" ON "Image"("herbId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "Herb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
