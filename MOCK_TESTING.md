# Testing the app with the built-in mock API

The backend isn't ready yet, so the app ships with an **in-memory mock API** that intercepts every
`HttpClient` call and answers it locally — no separate mock server, no `json-server`, nothing else
to install or run. It's already turned on.

## 1. How it works

- `src/environments/environment.ts` has `useMockApi: true` (dev only — `environment.prod.ts` has it
  `false`, so a production build never uses it).
- `src/app/core/interceptors/mock-api.interceptor.ts` intercepts any request to `environment.apiUrl`
  and answers it from an in-memory dataset (`src/app/core/mocks/mock-data.ts`) instead of hitting
  the network.
- Every screen in the app calls the exact same services/HttpClient code either way — nothing is
  special-cased per screen. When your friend's Spring Boot API is ready, you flip one flag off and
  the whole app switches from mock to real backend with zero other changes.
- Data really is mutated in memory: creating a request, approving/rejecting one, adding a user or
  application, etc. all update the mock dataset and show up immediately across the app. A full page
  reload (F5) resets everything back to the seed data below, since it only lives in the browser's
  memory for that session.

## 2. Run it

```bash
npm start
```
Open http://localhost:4200 — you'll land on the login screen.

## 3. Test accounts

Any password works (the mock ignores it). The login screen also shows one-click buttons for these
two accounts under "Modo de teste (mock API)":

| Email | Role | What you can test |
| --- | --- | --- |
| `eduardo.silva@natixis.com` | Colaborador | Dashboard, Meus Pedidos, Novo Pedido, Detalhe do Pedido, Aplicações (read-only) |
| `ana.costa@natixis.com` | Aprovador | Dashboard, Pedidos Pendentes, Aprovar/Rejeitar, Todos os Pedidos, Aplicações (CRUD), Utilizadores (CRUD), Auditoria |

Two more colaborador accounts exist in the seed data if you want more variety:
`joao.santos@natixis.com` and `mariana.rocha@natixis.com` (both Colaborador).

## 4. Suggested test path

**As Eduardo Silva (Colaborador):**
1. Log in → Dashboard shows "Pedidos Ativos 2/3" and a small table of recent requests.
2. Go to **Meus Pedidos** → you should see 4 requests (#15 Pendente, #17 Em Análise, #12 Aprovado,
   #11 Rejeitado). Try the Estado/Aplicação filters and the search box.
3. Click the eye icon on request #12 → **Detalhe do Pedido** should show the full state history
   (Pendente → Em Análise → Aprovado) with dates and responsible names.
4. Go to **Novo Pedido** → submit a new request. You should land on its detail page with state
   Pendente. Go back to Meus Pedidos and confirm it's now there, and the dashboard count went up.
5. Submit two more requests — on the 4th attempt you should get the "Limite de 3 pedidos ativos
   atingido" error (Eduardo already has 2 active + whatever you just added).
6. Open **Aplicações** — Colaboradores get a read-only list (no + button, no edit/delete).
7. Log out via **Perfil**.

**As Ana Costa (Aprovador):**
1. Log in → Dashboard shows global Pendentes/Em Análise/Aprovados/Rejeitados counts (no "Pedidos
   Ativos" card — that's colaborador-only).
2. Go to **Pedidos Pendentes** → you should see Eduardo's #15, João's #18, Mariana's #19, plus any
   new request you created as Eduardo above. Filter by Colaborador/Aplicação.
3. Click the eye icon on one → **Aprovar/Rejeitar Pedido**. Pick Aprovar or Rejeitar, write a
   justification (min. 10 characters), submit. You should land back on Pedidos Pendentes and the
   request should no longer be listed there.
4. Go to **Todos os Pedidos** → confirm that request now shows the new state.
5. Go to **Auditoria** → you should see new `APROVAR_PEDIDO`/`REJEITAR_PEDIDO`/`CRIAR_PEDIDO`
   entries at the top for everything you just did.
6. Go to **Aplicações** → as Aprovador you get + Nova Aplicação, edit (✎) and delete (🗑). Try
   creating one, editing one, deleting one.
7. Go to **Utilizadores** → same CRUD pattern. Try creating a Colaborador account, then log out and
   log in as that new account's email (any password) to confirm it actually works end-to-end.

## 5. Known mock limitations (won't matter once the real backend is in)

- No real password check — any password is accepted for any existing email.
- Data resets on full page reload (it's just a JS array in memory, not a database).
- Deletes use the browser's native `confirm()` dialog rather than a custom modal.
- `Auditoria`'s date filter fields (`dataInicio`/`dataFim`) are accepted by the mock's params
  reading but not currently filtered on — feel free to wire that up if you want it exercised before
  the backend exists, it's a couple of lines in `listAuditLogs()` in `mock-api.interceptor.ts`.

## 6. Switching to the real backend later

1. Set `useMockApi: false` in `src/environments/environment.ts`.
2. Point `apiUrl` at wherever the Spring Boot app runs (e.g. `http://localhost:8080/api`).
3. Make sure CORS is enabled on the Spring Boot side, or add an `ng serve --proxy-config` (see
   `README.md`).
4. That's it — no other file needs to change. `mock-api.interceptor.ts` self-disables via the flag
   and simply calls `next(req)` for every request, so it's safe to leave it registered in
   `app.config.ts` even in production (it's also hard-disabled there via `environment.prod.ts`).
