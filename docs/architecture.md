# System Architecture & Technical Specifications

```
                           +-------------------------------------+
                           |        TikTok / Social Inbound      |
                           +------------------+------------------+
                                              |
                                              v
+-----------------------------------------------------------------------------------------+
|                                    Nginx Reverse Proxy                                  |
+---------------------------------------------+-------------------------------------------+
                                              |
                     +------------------------+------------------------+
                     | Port 3000                                       |
                     v                                                 v
   +------------------------------------+             +-----------------------------------+
   |      Next.js / Vite Client App     |             |      Node.js / Express Core API   |
   |      - React 19 + Tailwind v4      |             |      - /api/v1/ REST Endpoints    |
   |      - Motion Animations           |             |      - JWT & Session Auth         |
   |      - Responsive Mobile-First UI  |             |      - RBAC Permission Guards     |
   +-----------------+------------------+             +-----------------+-----------------+
                     |                                                  |
                     |                                                  v
                     |                                +-----------------------------------+
                     |                                |    PostgreSQL 16 Engine (Prod)    |
                     +------------------------------->|    - Users, Content, Questions    |
                                                      |    - Saved items, Audit Logs      |
                                                      +-----------------+-----------------+
                                                                        |
                                                                        v
                                                      +-----------------------------------+
                                                      |    Redis 7.2 (Cache & Queue)      |
                                                      |    - Session Store, Rate Limiting |
                                                      +-----------------------------------+
```

## Layer Responsibilities
- **Client (Web)**: Single-page responsive web experience optimized for mobile TikTok traffic, with accessible navigation, typography pairing (Fraunces editorial serif + Plus Jakarta Sans body), warm soothing color scheme (#FAF8F5 canvas, terracotta accents, sage highlights), and zero-clutter reading modes.
- **Server (Core API)**: Express backend with typed REST routes under `/api/v1/`, handling authentication, RBAC authorization, CRUD for CMS content, question submission & answering lifecycle, and audit logging.
- **Database**: Relational schema normalized to 3NF, indexed for fast slug lookups, category filtering, and user bookmark queries.
