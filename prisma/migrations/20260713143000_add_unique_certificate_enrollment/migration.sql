-- Each completed enrollment can issue only one certificate. Renewals use a
-- separate recertification enrollment, so this also prevents duplicate clicks.
CREATE UNIQUE INDEX "certificates_enrollment_id_key" ON "certificates"("enrollment_id");
