"use client";

import { useMemo, useState } from "react";

type SceneItem = {
  size: number;
  top: string;
  left: string;
  depth: number;
  colorClass: string;
};

const items: SceneItem[] = [
  { size: 90, top: "8%", left: "6%", depth: 18, colorClass: "bg-sky-400/25" },
  { size: 60, top: "18%", left: "78%", depth: 12, colorClass: "bg-emerald-400/20" },
  { size: 110, top: "62%", left: "72%", depth: 22, colorClass: "bg-indigo-400/20" },
  { size: 50, top: "74%", left: "20%", depth: 16, colorClass: "bg-cyan-300/30" },
  { size: 36, top: "42%", left: "40%", depth: 10, colorClass: "bg-slate-300/35" },
];

export const ParallaxScene = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const transforms = useMemo(
    () =>
      items.map((item) => ({
        transform: `translate3d(${offset.x * (item.depth / 100)}px, ${offset.y * (item.depth / 100)}px, 0)`,
      })),
    [offset]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        setOffset({ x: x / 12, y: y / 12 });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span
          key={`${item.top}-${item.left}-${index}`}
          className={`absolute rounded-full blur-2xl transition-transform duration-300 ${item.colorClass}`}
          style={{
            width: `${item.size}px`,
            height: `${item.size}px`,
            top: item.top,
            left: item.left,
            ...transforms[index],
          }}
        />
      ))}
    </div>
  );
};
