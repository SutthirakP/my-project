-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "likes" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL
);
