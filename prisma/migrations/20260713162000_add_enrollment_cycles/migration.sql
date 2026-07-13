-- Preserve historical completions while allowing a new enrollment when a
-- certification needs recertification.
ALTER TABLE "enrollments" ADD COLUMN "cycle_number" INTEGER NOT NULL DEFAULT 1;
DROP INDEX IF EXISTS "enrollments_course_id_user_id_key";
CREATE UNIQUE INDEX "enrollments_course_id_user_id_cycle_number_key"
  ON "enrollments"("course_id", "user_id", "cycle_number");
CREATE INDEX "enrollments_course_id_user_id_idx" ON "enrollments"("course_id", "user_id");
