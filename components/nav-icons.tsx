import type { ReactElement } from "react";

export type IconKey =
  | "home"
  | "catalog"
  | "myCourses"
  | "certificates"
  | "admin"
  | "building"
  | "users"
  | "report";

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
    case "building":
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="10" height="17" rx="1" />
          <path d="M15 20v-6h4.5v6" />
          <path d="M8 7.5h1M11 7.5h1M8 11h1M11 11h1M8 14.5h1M11 14.5h1" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3" />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M15.5 13.2c2 .2 3.7 1.9 3.9 4.3" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M5 20V6.5A2.5 2.5 0 0 1 7.5 4H15l4 4v12a0 0 0 0 1 0 0H5" />
          <path d="M15 4v4h4" />
          <path d="M8.5 13v4M12 10.5v6.5M15.5 15v2.5" />
        </svg>
      );
  }
}
