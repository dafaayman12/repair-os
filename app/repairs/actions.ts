"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createRepair(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const customerWhatsapp = String(formData.get("customerWhatsapp") ?? "").trim();

  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const imei = String(formData.get("imei") ?? "").trim();
  const serialNumber = String(formData.get("serialNumber") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();

  const issue = String(formData.get("issue") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim();
  const laborPrice = Number(formData.get("laborPrice") ?? 0);

  if (!customerName || !brand || !model || !issue) {
    throw new Error("Customer name, brand, model, and issue are required.");
  }

  const customer = await prisma.customer.create({
    data: {
      fullName: customerName,
      phone: customerPhone || null,
      whatsapp: customerWhatsapp || null,
    },
  });

  const device = await prisma.device.create({
    data: {
      customerId: customer.id,
      brand,
      model,
      imei: imei || null,
      serialNumber: serialNumber || null,
      color: color || null,
    },
  });

  const repairNumber = `REP-${Date.now()}`;

  await prisma.repair.create({
    data: {
      repairNumber,
      customerId: customer.id,
      deviceId: device.id,
      issue,
      diagnosis: diagnosis || null,
      laborPrice: Number.isNaN(laborPrice) ? 0 : laborPrice,
      totalPrice: Number.isNaN(laborPrice) ? 0 : laborPrice,
    },
  });

  revalidatePath("/repairs");
  redirect("/repairs");
}