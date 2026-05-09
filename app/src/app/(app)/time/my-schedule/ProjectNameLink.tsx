"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Client wrapper around `<Link>` that stops click bubbling.
 *
 * Why a separate client component: `MySchedulePage` is a server
 * component (it does `await prisma.*` data fetching directly). Server
 * components can't pass event handlers like `onClick` to JSX —
 * that throws "Event handlers cannot be passed to Client Component
 * props" at render time, which Next.js surfaces in production as
 * the generic "Something went wrong" page.
 *
 * The stopPropagation matters because the link sits inside a
 * `<summary>` element. Without it, clicking the project name would
 * both navigate AND toggle the details collapse — the user
 * shouldn't have to fight the disclosure widget when they wanted to
 * jump to the project detail page.
 */
export function ProjectNameLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-semibold text-[#1A2E22] hover:text-[#2D6A4F] transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
}
