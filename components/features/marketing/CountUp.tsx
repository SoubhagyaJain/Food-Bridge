"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type CountUpProps = {
  target: number;
  suffix?: string;
  className?: string;
  /** Parent-controlled trigger — starts count when true */
  start?: boolean;
  /** Delay before counting begins (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  target,
  suffix = "+",
  className,
  start = false,
  delay = 0,
  duration = 2,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const hasRun = useRef(false);

  useEffect(() => {
    hasRun.current = false;
  }, [target, delay, duration, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !start || hasRun.current) return;

    hasRun.current = true;

    if (reduceMotion) {
      el.textContent = `${target.toLocaleString()}${suffix}`;
      return;
    }

    const delayMs = delay * 1000;
    const durationMs = duration * 1000;
    let frameId = 0;
    let startTime: number | null = null;
    let lastRendered = -1;

    el.textContent = `0${suffix}`;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      if (elapsed < delayMs) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((elapsed - delayMs) / durationMs, 1);
      const next = Math.round(target * easeOutCubic(progress));

      if (next !== lastRendered) {
        lastRendered = next;
        el.textContent = `${next.toLocaleString()}${suffix}`;
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [start, target, delay, duration, reduceMotion, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}