"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request!",
    };
  }

  const token = (Math.random() * 1000).toString();

  await prisma.onRampTransaction.create({
    data: {
      status: "Processing",
      token: token,
      provider: provider,
      amount: amount * 100,
      startTime: new Date(),
      userId: userId,
    },
  });

  return {
    message: "On Ramp Transaction completed!",
  };
}