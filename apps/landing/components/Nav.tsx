"use client";

import { useEffect, useRef } from "react";

const links = [
  { href: "#como", label: "Como funciona" },
  { href: "#diferencial", label: "Diferencial" },
  { href: "#transparencia", label: "Transparência" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.style.boxShadow =
        window.scrollY > 8 ? "0 8px 24px -16px rgba(21,19,26,.4)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" ref={navRef}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="MatchGoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/matchgoal-logo.png" alt="MatchGoal" />
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <span className="seal18">+18</span>
        </div>
      </div>
    </header>
  );
}
