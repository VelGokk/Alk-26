"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { createLiveStream, isMuxConfigured } from "@/lib/integrations/mux";

export async function createLiveSession(formData: FormData) {
  const session = await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  const title = String(formData.get("title") ?? "");
  const scheduledAtRaw = String(formData.get("scheduledAt") ?? "");
  if (!title) return;

  const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw) : null;

  let muxData: { muxLiveStreamId?: string; streamKey?: string; playbackId?: string } = {};

  if (isMuxConfigured) {
    muxData = await createLiveStream(title);
  }

  await prisma.liveSession.create({
    data: {
      title,
      scheduledAt,
      status: isMuxConfigured ? "scheduled" : "disabled",
      muxLiveStreamId: muxData.muxLiveStreamId,
      muxStreamKey: muxData.streamKey,
      muxPlaybackId: muxData.playbackId,
      createdById: session.user.id,
    },
  });

  revalidatePath("/super-admin/live-sessions");
  revalidatePath("/admin/live-sessions");
}
