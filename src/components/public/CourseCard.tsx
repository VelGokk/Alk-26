import Link from "next/link";
import Image from "next/image";
import { Course } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

type CourseCardProps = {
  course: Course;
  lang: string;
};

export default function CourseCard({ course, lang }: CourseCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 shadow-glow">
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-black/5">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.3em] text-zinc-500">
            ALKAYA
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          {course.status}
        </p>
        <h3 className="font-heading text-xl">{course.title}</h3>
        <p className="text-sm text-zinc-600">{course.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-ink">
            {formatCurrency(course.price, course.currency)}
          </span>
          <Link
            href={`/${lang}/courses`}
            className="text-xs uppercase tracking-[0.2em] text-brass"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}
