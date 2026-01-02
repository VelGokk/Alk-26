import Mux from "@mux/mux-node";
import { hasEnv } from "@/lib/env";

export const isMuxConfigured =
  hasEnv("MUX_TOKEN_ID") && hasEnv("MUX_TOKEN_SECRET");

const muxClient = isMuxConfigured
  ? new Mux({
      tokenId: process.env.MUX_TOKEN_ID as string,
      tokenSecret: process.env.MUX_TOKEN_SECRET as string,
    })
  : null;

export async function createLiveStream(title: string) {
  if (!muxClient) {
    throw new Error("Mux not configured");
  }

  const liveStream = await muxClient.video.liveStreams.create({
    playback_policy: ["public"],
    new_asset_settings: { playback_policy: ["public"] },
    name: title,
  });

  return {
    muxLiveStreamId: liveStream.id,
    streamKey: liveStream.stream_key,
    playbackId: liveStream.playback_ids?.[0]?.id,
  };
}
