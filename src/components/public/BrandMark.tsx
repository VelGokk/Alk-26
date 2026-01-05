import Image from "next/image";
import Link from "next/link";
import { getBranding } from "@/lib/settings";
import dictionary from "@/config/dictionaries/es.json";

export default async function BrandMark({ href }: { href: string }) {
  const branding = await getBranding();
  const brandName = dictionary.brand;
  const brandInitial = brandName.slice(0, 1);

  return (
    <Link href={href} className="flex items-center gap-3">
      {branding.logoUrl ? (
        <Image
          src={branding.logoUrl}
          alt={brandName}
          width={40}
          height={40}
          className="rounded-lg border border-black/10 object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-xs font-heading text-white">
          {brandInitial}
        </div>
      )}
      <div>
        <p className="font-heading text-lg tracking-wide text-deep">
          {brandName}
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.32em] text-slate-500">
          {dictionary.brandMark.tagline}
        </p>
      </div>
    </Link>
  );
}
