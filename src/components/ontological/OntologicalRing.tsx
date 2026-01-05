"use server";

import type { AppLocale } from "@/lib/i18n";
import {
  createTranslator,
  getDictionary,
  isLocale,
  DEFAULT_LOCALE,
} from "@/lib/i18n";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgramProgressSegments } from "@/lib/programs";

const SEGMENT_META = [
  {
    key: "observacion" as const,
    color: "#0d6efd",
    labelKey: "education.programPhaseDISCOVERY",
    startAngle: -90,
  },
  {
    key: "orden" as const,
    color: "#0ea5e9",
    labelKey: "education.programPhaseORDEN",
    startAngle: 0,
  },
  {
    key: "accion" as const,
    color: "#f97316",
    labelKey: "education.programPhaseACCION",
    startAngle: 90,
  },
  {
    key: "sostenimiento" as const,
    color: "#14b8a6",
    labelKey: "education.programPhaseSUSTAINMENT",
    startAngle: 180,
  },
] as const;

type SegmentKey = (typeof SEGMENT_META)[number]["key"];

type Props = {
  programId: string;
  lang?: AppLocale;
  size?: number;
  className?: string;
};

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

export default async function OntologicalRing({
  programId,
  lang,
  size = 220,
  className = "",
}: Props) {
  const resolvedLang = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(resolvedLang);
  const translate = createTranslator(dictionary);
  const session = await getServerSession(authOptions);

  const summary =
    session?.user?.id
      ? await getProgramProgressSegments(programId, session.user.id)
      : {
          segments: SEGMENT_META.map((segment) => ({
            key: segment.key,
            total: 0,
            completed: 0,
            percent: 0,
          })),
          overallPercent: 0,
          totalLessons: 0,
        };

  const segments = summary.segments.map((segment) => {
    const meta = SEGMENT_META.find((entry) => entry.key === segment.key)!;
    return {
      ...segment,
      label: translate(meta.labelKey),
      color: meta.color,
      startAngle: meta.startAngle,
    };
  });

  const activeLabel = segments
    .map((segment) => `${segment.label} ${segment.percent}%`)
    .join(", ");

  const strokeWidth = 16;
  const radius = size / 2 - strokeWidth / 2;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        role="img"
        aria-label={`Progreso ontológico: ${activeLabel}`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="ontological-ring"
        >
          {segments.map((segment) => {
            const path = describeArc(
              cx,
              cy,
              radius,
              segment.startAngle,
              segment.startAngle + 90
            );
            return (
              <path
                key={`bg-${segment.key}`}
                d={path}
                stroke="rgba(15,23,42,0.2)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
          {segments.map((segment) => {
            const path = describeArc(
              cx,
              cy,
              radius,
              segment.startAngle,
              segment.startAngle + 90
            );
            const dashOffset = Math.max(0, 100 - segment.percent);
            return (
              <path
                key={`progress-${segment.key}`}
                d={path}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="100"
                strokeDashoffset={dashOffset}
                className="progress"
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">
            {translate("education.programProgressLabel")}
          </p>
          <p className="font-heading text-4xl text-ink">
            {summary.overallPercent}%
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {summary.totalLessons}{" "}
            {translate("education.programLessonsLabel")}
          </p>
        </div>
        {/* Styles moved to global CSS to keep this as a Server Component */}
      </div>
      <ul className="grid gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {segments.map((segment) => (
          <li
            key={segment.key}
            className="flex items-center justify-between text-[10px] font-semibold"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-8 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>
            <span className="text-ink">{segment.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
