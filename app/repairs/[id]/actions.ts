"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  Priority,
  RepairStatus,
} from "@/app/generated/prisma/client";

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

export async function removePartFromRepair(formData: FormData) {
  const repairId = String(formData.get("repairId") ?? "").trim();
  const partId = String(formData.get("partId") ?? "").trim();
  const confirmRemove = String(formData.get("confirmRemove") ?? "").trim();

  if (!repairId || !partId) {
    throw new Error("Repair and part are required.");
  }

  if (confirmRemove !== "true") {
    throw new Error("Please confirm removal before continuing.");
  }

  const repair = await prisma.repair.findUnique({
    where: { id: repairId },
    select: { id: true, laborPrice: true },
  });

  if (!repair) {
    throw new Error("Repair not found.");
  }

  const part = await prisma.repairPartUsed.findUnique({
    where: { id: partId },
    select: {
      id: true,
      repairId: true,
      inventoryItemId: true,
      quantity: true,
    },
  });

  if (!part || part.repairId !== repairId) {
    throw new Error("Part not found for this repair.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.repairPartUsed.delete({
      where: { id: partId },
    });

    await tx.inventoryItem.update({
      where: { id: part.inventoryItemId },
      data: {
        quantityInStock: {
          increment: part.quantity,
        },
      },
    });

    const parts = await tx.repairPartUsed.findMany({
      where: { repairId },
      select: { totalCost: true },
    });

    const partsCost = parts.reduce((sum, item) => sum + item.totalCost, 0);

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

export async function updateRepairDetails(formData: FormData) {
  const repairId = String(formData.get("repairId") ?? "").trim();
  const issue = String(formData.get("issue") ?? "").trim();
  const diagnosisRaw = String(formData.get("diagnosis") ?? "").trim();
  const laborPriceRaw = Number(formData.get("laborPrice") ?? 0);
  const paymentStatusRaw = String(formData.get("paymentStatus") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "").trim();

  if (!repairId || !issue) {
    throw new Error("Repair and issue are required.");
  }

  if (Number.isNaN(laborPriceRaw) || laborPriceRaw < 0) {
    throw new Error("Labor price must be a valid non-negative number.");
  }

  const allowedPaymentStatuses = ["UNPAID", "PARTIAL", "PAID"] as const;
  if (
    !allowedPaymentStatuses.includes(
      paymentStatusRaw as (typeof allowedPaymentStatuses)[number]
    )
  ) {
    throw new Error("Invalid payment status.");
  }

  const allowedPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
  if (
    !allowedPriorities.includes(priorityRaw as (typeof allowedPriorities)[number])
  ) {
    throw new Error("Invalid priority.");
  }

  const repair = await prisma.repair.findUnique({
    where: { id: repairId },
    select: { id: true, partsCost: true },
  });

  if (!repair) {
    throw new Error("Repair not found.");
  }

  const laborPrice = laborPriceRaw;
  const paymentStatus = paymentStatusRaw as PaymentStatus;
  const priority = priorityRaw as Priority;
  const diagnosis = diagnosisRaw || null;

  await prisma.repair.update({
    where: { id: repairId },
    data: {
      issue,
      diagnosis,
      laborPrice,
      paymentStatus,
      priority,
      totalPrice: laborPrice + repair.partsCost,
    },
  });

  revalidatePath(`/repairs/${repairId}`);
  revalidatePath("/repairs");
}
