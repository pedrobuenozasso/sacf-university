CREATE TABLE "notification_logs" (
    "id" UUID NOT NULL,
    "notification_key" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "notification_logs_notification_key_key" ON "notification_logs"("notification_key");
CREATE INDEX "notification_logs_sent_at_idx" ON "notification_logs"("sent_at");
