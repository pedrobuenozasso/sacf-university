#!/bin/sh
# Runs on the Hostinger VPS. Keeps a verified local PostgreSQL dump and a
# private off-site copy in the Academy media bucket. No secrets are stored in
# this script: they are read from the running container at execution time.
set -eu

umask 077

backup_dir=/var/backups/sacf-academy
container=sacf-academy
retention_days=30
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$backup_dir"

host="$(docker exec "$container" printenv DB_HOST)"
port="$(docker exec "$container" printenv DB_PORT)"
database="$(docker exec "$container" printenv DB_NAME)"
username="$(docker exec "$container" printenv DB_USER)"
password="$(docker exec "$container" printenv DB_PASSWORD)"
target="$backup_dir/academy-$timestamp.dump"
object="backups/sacf-academy/postgres/academy-$timestamp.dump"

# A custom-format dump supports selective restore and is checked immediately
# before being retained or copied off-site.
docker run --rm --network sacf-net \
  -e PGPASSWORD="$password" \
  postgres:18-alpine pg_dump \
  --host "$host" \
  --port "${port:-5432}" \
  --username "$username" \
  --dbname "$database" \
  --format=custom \
  --no-owner \
  --no-privileges > "$target"

test -s "$target"
docker run --rm -v "$backup_dir:/backups:ro" postgres:18-alpine \
  pg_restore --list "/backups/$(basename "$target")" >/dev/null

# The production image includes the Google Storage SDK. Copy the already
# verified dump into the app container only for the upload, then remove it.
docker cp "$target" "$container:/tmp/sacf-academy-backup.dump"
docker exec -e BACKUP_OBJECT="$object" "$container" node - <<'NODE'
const { Storage } = require("@google-cloud/storage");

async function main() {
  const raw = process.env.GCS_SERVICE_ACCOUNT_JSON_BASE64;
  if (!raw || !process.env.GCS_MEDIA_BUCKET || !process.env.BACKUP_OBJECT) {
    throw new Error("Academy backup storage is not configured");
  }
  const credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  const storage = new Storage({ credentials });
  await storage.bucket(process.env.GCS_MEDIA_BUCKET).upload("/tmp/sacf-academy-backup.dump", {
    destination: process.env.BACKUP_OBJECT,
    resumable: false,
    metadata: { contentType: "application/octet-stream" }
  });

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const [files] = await storage.bucket(process.env.GCS_MEDIA_BUCKET).getFiles({ prefix: "backups/sacf-academy/postgres/" });
  await Promise.all(files
    .filter((file) => new Date(file.metadata.updated ?? 0).getTime() < cutoff)
    .map((file) => file.delete({ ignoreNotFound: true })));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
NODE
# docker cp preserves root ownership; remove only this temporary artifact with
# the container's root user after the upload completes.
docker exec -u 0 "$container" rm -f /tmp/sacf-academy-backup.dump

find "$backup_dir" -type f -name "academy-*.dump" -mtime +"$retention_days" -delete
echo "academy backup completed: $target -> gs://$(docker exec "$container" printenv GCS_MEDIA_BUCKET)/$object"
