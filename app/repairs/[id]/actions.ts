"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { RepairStatus } from "@/app/generated/prisma/client";

export async function addPartToRepair(formData: FormData) {
  const repairId = String(formData.get("repairId") ?? "").trim();
  const inventoryItemId = String(formData.get("inventoryItemId") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!repairId || !inventoryItemId || !quantity || quantity < 1) {
    throw new Error("Repair, item, and quantity are required.");
  }

  const repair = await prisma.repair.findUnique({
    where: { id: repairId },
    select: { id: true, laborPrice: true },
  });

  if (!repair) {
    throw new Error("Repair not found.");
  }

  const item = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!item) {
    throw new Error("Inventory item not found.");
  }

  if (item.quantityInStock < quantity) {
    throw new Error("Not enough stock for this item.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.repairPartUsed.create({
      data: {
        repairId,
        inventoryItemId,
        quantity,
        unitCost: item.buyPrice,
        totalCost: item.buyPrice * quantity,
      },
    });

    await tx.inventoryItem.update({
      where: { id: inventoryItemId },
      data: {
        quantityInStock: {
          decrement: quantity,
        },
      },
    });

    const parts = await tx.repairPartUsed.findMany({
      where: { repairId },
      select: { totalCost: true },
    });

    const partsCost = parts.reduce((sum, part) => sum + part.totalCost, 0);

    await tx.repair.update({
      where: { id: repairId },
      data: {
        partsCost,
        totalPrice: repair.laborPrice + partsCost,
      },
    });
  });

  revalidatePath(`/repairs/${repairId}`);
  revalidatePath("/repairs");
  revalidatePath("/inventory");
}

export async function updateRepairStatus(formData: FormData) {
  const repairId = String(formData.get("repairId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!repairId || !statusRaw) {
    throw new Error("Repair and status are required.");
  }

  const allowedStatuses = [
    "NEW",
    "DIAGNOSING",
    "WAITING_PART",
    "IN_PROGRESS",
    "READY",
    "CLOSED",
  ] as const;

  if (!allowedStatuses.includes(statusRaw as (typeof allowedStatuses)[number])) {
    throw new Error("Invalid repair status.");
  }

  const status = statusRaw as RepairStatus;

  await prisma.repair.update({
    where: { id: repairId },
    data: {
      status,
      closedAt: status === "CLOSED" ? new Date() : null,
    },
  });

  revalidatePath(`/repairs/${repairId}`);
  revalidatePath("/repairs");
}