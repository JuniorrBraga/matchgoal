"use client";

import { useEffect, useRef, useState } from "react";

// [acerto%, erro%] por semana — alturas ilustrativas
const weeks: [number, number][] = [
  [62, 38], [58, 42], [71, 29], [55, 45], [66, 34], [73, 27],
  [60, 40], [68, 32], [77, 23], [64, 36], [70, 30], [59, 41],
];
const labels = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12"];

export function TrackBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setFilled(true);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bars" id="trackbars" ref={ref}>
      {weeks.map(([acerto, erro], i) => (
        <div className="barcol" key={labels[i]}>
          <div className="seg erro" style={{ height: filled ? erro * 0.55 : 0 }} />
          <div className="seg acerto" style={{ height: filled ? acerto * 0.95 : 0 }} />
          <div className="lab">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
