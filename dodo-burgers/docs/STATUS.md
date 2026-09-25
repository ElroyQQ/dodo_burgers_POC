# System status

> Roll-up of every <component>/STATUS.md. Detail lives in the linked file.

| Component | State | Headline gap | In flight | Detail |
| --- | --- | --- | --- | --- |
| storefront | ✅ built | none — no backend/order-submission is by design, not a gap | — | [storefront/STATUS.md](storefront/STATUS.md) |
| auth | ✅ built | no session/token issued — "logged in" state is an unauthenticated display cache, not enforced auth | — | [auth/STATUS.md](auth/STATUS.md) |

## Cross-cutting
No §4.5 law is currently FAILing. One cross-cutting open item: **`auth` issues
no session/token**, so nothing in `storefront` can safely gate on login state
today, and none currently does. If a future feature wants real per-user
behavior (saved builds, order history), it needs a `Session` `Dat` and a
signed `Trm` added to `auth` first — see `auth/ARCHITECTURE.md` §9 and
`auth/STATUS.md`. Not a defect in what exists; a boundary future work must
respect.
