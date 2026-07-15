# Deploy na Hostinger VPS: SACF Academy

## Arquitetura

O Docker Manager executa o container `sacf-academy` apenas na interface local da VPS (`127.0.0.1:3001`). O Nginx já responsável por `sacf.io` mantém o site principal e encaminha apenas `https://sacf.io/academy` para esse container.

Banco PostgreSQL, Resend e Google Cloud Storage continuam externos e não recebem containers locais.

## Primeiro deploy no Docker Manager

1. Em **VPS → Docker Manager → Compose**, escolha **Compose from URL**.
2. Use a URL bruta do arquivo `docker-compose.yml` na branch `main` do GitHub.
3. Nomeie o projeto como `sacf-academy`.
4. Preencha as mesmas variáveis descritas no workflow, sem salvar credenciais no repositório.
5. Faça o deploy e confirme que o container responde em `127.0.0.1:3001` dentro da VPS.

## Nginx

Copie o conteúdo de `deploy/nginx-sacf-academy.conf` para o bloco `server` HTTPS de `sacf.io`, teste e recarregue:

```bash
nginx -t && systemctl reload nginx
```

## Deploy automático

No GitHub, em **Settings → Secrets and variables → Actions**, configure:

- Secret `HOSTINGER_API_KEY` e variável `HOSTINGER_VM_ID`;
- Secrets de banco, autenticação, Resend e Google Cloud Storage listados em `.github/workflows/deploy-hostinger.yml`.

Após isso, cada push na `main` executa o workflow e atualiza somente o projeto `sacf-academy`.
