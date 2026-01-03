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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-xs font-heading text-white">
          A
        </div>
      )}
      <div>
        <p className="font-heading text-lg tracking-wide text-deep">ALKAYA</p>
        <p className="font-sans text-xs uppercase tracking-[0.32em] text-slate-500">
          Consultoria Ontologica
        </p>
      </div>
    </Link>
  );
}
