import Image from "next/image";
import Link from "next/link";
import { getBranding } from "@/lib/settings";

export default async function BrandMark({ href }: { href: string }) {
  const branding = await getBranding();

  return (
    <Link href={href} className="flex items-center gap-3">
      {branding.logoUrl ? (
        <Image
          src={branding.logoUrl}
          alt="ALKAYA"
          width={40}
          height={40}
          className="rounded-lg border border-black/10 object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-ink text-white text-xs flex items-center justify-center font-heading">
          A
        </div>
      )}
      <div>
        <p className="font-heading text-lg tracking-wide">ALKAYA</p>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          Learning Suite
        </p>
      </div>
    </Link>
  );
}
