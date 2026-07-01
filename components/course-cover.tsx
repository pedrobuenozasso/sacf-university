import Image from "next/image";
import type { ReactElement } from "react";
import { getOrganization, type Course } from "@/lib/courses";

function verticalIcon(vertical: string, className: string): ReactElement {
  const key = vertical.toLowerCase();
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  if (key.includes("operad")) {
    return (
      <svg {...common}>
        <path d="M4 15a8 8 0 0 1 16 0" />
        <path d="M12 15l4.5-3.5" />
        <path d="M4 15h1.5M18.5 15H20M7 9l1 1M17 9l-1 1" />
      </svg>
    );
  }

  if (key.includes("mec")) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  if (key.includes("elétr") || key.includes("eletr") || key.includes("tens")) {
    return (
      <svg {...common}>
        <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" />
      </svg>
    );
  }

  if (key.includes("repres")) {
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}

export function CourseCover({ course, showTenantBrand = false }: { course: Course; showTenantBrand?: boolean }) {
  const ownerOrg = getOrganization(course.organizationSlugs[0]);
  const orgName = ownerOrg?.name ?? "SACF";

  return (
    <div className="cover" data-accent={course.accent}>
      <span className="coverGrid" aria-hidden="true" />
      {verticalIcon(course.vertical, "coverMotif")}

      <div className="coverTop">
        <span className="coverBrandGroup">
          <span className="coverBrand">
            <Image src="/brand/sacf-app-icon-v2.png" alt="SACF University" width={26} height={26} />
          </span>
          {showTenantBrand && ownerOrg?.brandLogo ? (
            <span className="coverBrand coverBrandTenant">
              <Image src={ownerOrg.brandLogo} alt={orgName} width={26} height={26} />
            </span>
          ) : null}
        </span>
        <span className="coverLevel">{course.level}</span>
      </div>

      <div className="coverBottom">
        <span className="coverVertical">
          {verticalIcon(course.vertical, "coverVerticalIcon")}
          {course.vertical}
        </span>
        <span className="coverDuration">{course.duration}</span>
      </div>

      <span className="coverPlay" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}
