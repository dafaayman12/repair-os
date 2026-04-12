import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.repairPartUsed.deleteMany();
  await prisma.repair.deleteMany();
  await prisma.device.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();

  const supplier = await prisma.supplier.create({
    data: {
      name: "Marrakech Mobile Parts",
      phone: "0600000000",
      whatsapp: "0600000000",
      city: "Marrakech",
      notes: "Demo supplier",
    },
  });

  await prisma.inventoryItem.createMany({
    data: [
      {
        sku: "IP11-OLED-BLK",
        name: "iPhone 11 OLED Screen",
        category: "Screen",
        compatibleModels: "iPhone 11",
        quantityInStock: 6,
        minStock: 2,
        buyPrice: 320,
        sellPrice: 500,
        supplierId: supplier.id,
        location: "Shelf A1",
        notes: "Black",
      },
      {
        sku: "IP11-BATT-01",
        name: "iPhone 11 Battery",
        category: "Battery",
        compatibleModels: "iPhone 11",
        quantityInStock: 10,
        minStock: 3,
        buyPrice: 140,
        sellPrice: 250,
        supplierId: supplier.id,
        location: "Shelf B1",
      },
      {
        sku: "SAM-A13-SCR",
        name: "Samsung A13 Screen",
        category: "Screen",
        compatibleModels: "Samsung A13",
        quantityInStock: 4,
        minStock: 2,
        buyPrice: 220,
        sellPrice: 380,
        supplierId: supplier.id,
        location: "Shelf A2",
      },
      {
        sku: "USB-C-FLEX-A13",
        name: "Samsung A13 Charging Flex",
        category: "Charging Part",
        compatibleModels: "Samsung A13",
        quantityInStock: 9,
        minStock: 3,
        buyPrice: 45,
        sellPrice: 100,
        supplierId: supplier.id,
        location: "Drawer C2",
      },
      {
        sku: "IP-SCREW-SET",
        name: "iPhone Screw Set",
        category: "Screws",
        compatibleModels: "Multiple iPhone models",
        quantityInStock: 30,
        minStock: 10,
        buyPrice: 8,
        sellPrice: 20,
        supplierId: supplier.id,
        location: "Drawer D1",
      },
      {
        sku: "B7000-15ML",
        name: "B7000 Adhesive 15ml",
        category: "Consumable",
        compatibleModels: "Universal",
        quantityInStock: 12,
        minStock: 4,
        buyPrice: 18,
        sellPrice: 35,
        supplierId: supplier.id,
        location: "Drawer E1",
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });