# Operação e recuperação — SACF Academy

## Saúde

O endpoint público é `https://sacf.io/academy/api/health`. Ele retorna `200` somente quando a aplicação acessa o banco. O container também possui healthcheck interno a cada 30 segundos.

```sh
docker inspect sacf-academy --format '{{.State.Status}} {{.State.Health.Status}}'
SMOKE_BASE_URL=https://sacf.io/academy npm run test:smoke
```

## Rotinas da VPS

- `08:15`: `/usr/local/sbin/sacf-academy-notifications` envia lembretes de prazo de curso e vencimento de certificado em 7, 3, 1 e 0 dias. Os envios são idempotentes em `notification_logs`.
- `03:30`: `/usr/local/sbin/sacf-academy-backup` cria backup PostgreSQL, valida com `pg_restore --list` e mantém 14 dias em `/var/backups/sacf-academy`.

```sh
tail -100 /var/log/sacf-academy-notifications.log
tail -100 /var/log/sacf-academy-backup.log
```

## Restauração

1. Crie um banco de destino vazio e pare a Academy.
2. Use `pg_restore` da mesma versão principal do Cloud SQL (atualmente PostgreSQL 18).
3. Restaure primeiro em ambiente de teste e valide login, cursos e certificados.
4. Só restaure produção com aprovação explícita.

O backup atual fica na própria VPS; a próxima melhoria obrigatória é a cópia para Cloud Storage ou a confirmação de backup nativo do Cloud SQL.

## Checklist de liberação

- Health endpoint responde 200 e container está `running healthy`.
- Login, convite, recuperação, upload, prova e certificado foram testados.
- Admin de empresa não enxerga dados de outra empresa.
- Backup do dia existe e é legível pelo `pg_restore`.
- `npm run lint`, `npx tsc --noEmit` e `npm run build` passam.

## Antivírus

Os uploads já têm validação de assinatura, MIME, tamanho e escopo. ClamAV deve ser incluído como serviço isolado apenas após reservar memória e armazenamento na VPS.
