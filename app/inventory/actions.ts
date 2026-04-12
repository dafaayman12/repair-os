"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createInventoryItem(formData: FormData) {
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const compatibleModels = String(formData.get("compatibleModels") ?? "").trim();
  const quantityInStock = Number(formData.get("quantityInStock") ?? 0);
  const minStock = Number(formData.get("minStock") ?? 0);
  const buyPrice = Number(formData.get("buyPrice") ?? 0);
  const sellPriceRaw = String(formData.get("sellPrice") ?? "").trim();
  const supplierIdRaw = String(formData.get("supplierId") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!sku || !name || !category) {
    throw new Error("SKU, name, and category are required.");
  }

  await prisma.inventoryItem.create({
    data: {
      sku,
      name,
      category,
      compatibleModels: compatibleModels || null,
      quantityInStock: Number.isNaN(quantityInStock) ? 0 : quantityInStock,
      minStock: Number.isNaN(minStock) ? 0 : minStock,
      buyPrice: Number.isNaN(buyPrice) ? 0 : buyPrice,
      sellPrice: sellPriceRaw ? Number(sellPriceRaw) : null,
      supplierId: supplierIdRaw || null,
      location: location || null,
      notes: notes || null,
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}