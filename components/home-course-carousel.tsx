"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/course-card";
import type { Course } from "@/lib/courses";

export function HomeCourseCarousel({
  courses,
  href = "/catalogo"
}: {
  courses: Course[];
  href?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldRotate = courses.length > 1;

  useEffect(() => {
    if (!shouldRotate) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % courses.length);
    }, 7600);
    return () => window.clearInterval(timer);
  }, [courses.length, shouldRotate]);

  function positionFor(index: number) {
    if (!shouldRotate) return "active";
    const distance = (index - activeIndex + courses.length) % courses.length;
    if (distance === 0) return "active";
    if (distance === 1) return "next";
    if (distance === courses.length - 1) return "previous";
    return "hidden";
  }

  return (
    <div className="homeCourseCarousel">
      <div className="homeCourseViewport">
        <div className="homeCourseTrack">
          {courses.map((course, index) => (
            <div className="homeCourseSlide" data-position={positionFor(index)} key={course.slug}>
              <CourseCard course={course} href={href === "/catalogo" ? `${href}/${course.slug}` : href} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
