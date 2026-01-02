 "use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

export async function addToCart(formData: FormData) {
  const session = await requireSession();
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return;

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  await prisma.cartItem.upsert({
    where: { cartId_courseId: { cartId: cart.id, courseId } },
    update: { quantity: 1 },
    create: { cartId: cart.id, courseId, quantity: 1 },
  });

  revalidatePath("/courses");
}

export async function removeFromCart(formData: FormData) {
  const session = await requireSession();
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });
  if (!cart) return;

  await prisma.cartItem.delete({
    where: { cartId_courseId: { cartId: cart.id, courseId } },
  });

  revalidatePath("/checkout");
}
