# LinComms Architecture (draft)

```mermaid
flowchart LR
  subgraph Client[Frontend - Next.js / React / TS]
    UI[Chat UI]
  end

  subgraph API[Backend - Node.js / Express / TS]
    REST[REST / WS Handlers]
    Services[Domain Services]
  end

  subgraph Infra[Infrastructure]
    DB[(PostgreSQL)]
    Cache[(Redis)]
  end

  UI <--> REST
  REST <--> Services
  Services <--> DB
  Services <--> Cache
  UI <-- WebSocket --> REST
