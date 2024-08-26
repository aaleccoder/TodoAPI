-- CreateTable
CREATE TABLE "TokenApiKey" (
    "token" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenApiKey_token_key" ON "TokenApiKey"("token");
