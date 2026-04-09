"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `pw-reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`pw-reveal ${delayClass} ${visible ? "visible" : ""}`}>
      {children}
    </div>
  );
}
