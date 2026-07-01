import type { ReactElement } from "react";

export type IconKey = "home" | "catalog" | "myCourses" | "certificates" | "admin";

export function navIcon(key: IconKey, className = "sidebarNavIcon"): ReactElement {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (key) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.5 20v-6h5v6" />
        </svg>
      );
    case "catalog":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
          <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
          <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
          <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
        </svg>
      );
    case "myCourses":
      return (
        <svg {...common}>
          <path d="M4 5.5c2.5-1.3 5-1.3 7 0v13c-2-1.3-4.5-1.3-7 0z" />
          <path d="M20 5.5c-2.5-1.3-5-1.3-7 0v13c2-1.3 4.5-1.3 7 0z" />
        </svg>
      );
    case "certificates":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="5.5" />
          <path d="M8.3 13 7 20l5-2.6L17 20l-1.3-7" />
        </svg>
      );
    case "admin":
      return (
        <svg {...common}>
          <rect x="3.5" y="7" width="17" height="12" rx="1.5" />
          <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
        </svg>
      );
  }
}
