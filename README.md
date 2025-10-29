# LinComms

> **LinComms** is a **security-first, invite-only communications platform**.
> Unlike traditional messengers, LinComms enforces **admin-controlled invites** and **role-based access control**, ensuring communication is private, trusted, and controlled.

---

## 🚀 Features

- 🔒 **Invite-only access** — only admins can invite new members
- 🧑‍🤝‍🧑 **Role-based access control** (Admin / Member)
- 💬 **Secure messaging** (real-time, WebSockets)
- ✅ **Authentication system** with JWT + password hashing
- 🐳 **Dockerized environment** for consistent local development
- 🧪 **Automated testing** with Jest + Cypress
- 🌐 **Deployment ready** for Vercel + Railway

---

## 🛠️ Built With

- **Frontend:** React, Next.js, TailwindCSS
- **Backend:** Node.js, Express, Socket.IO
- **Database:** PostgreSQL, Prisma ORM
- **Real-time:** WebSockets, Redis
- **DevOps:** Docker, Railway, Vercel
- **Testing:** Jest, Cypress
- **Auth & Security:** JWT, bcrypt, Role-based Access Control

---

## 📖 Documentation

- [Database Schema](./docs/db.md)
- [Authentication Flow](./docs/auth.md)
- [Development Workflow](./docs/workflow.md)

---

## 🗺️ Roadmap

- [x] Database schema with `User` + `Invite` models
- [ ] Authentication API with JWT & role-based access
- [ ] Authentication UI (login, signup via invite, logout)
- [ ] Real-time messaging (Socket.IO + Redis pub/sub)
- [ ] Presence tracking (online/offline indicators)
- [ ] Group conversations & channels
- [ ] Offline sync

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

### 🔐 Invite-Only Signup

LinComms enforces an invite-based onboarding model.
Each invite is cryptographically signed using a private key (only held by the admin).
This ensures only authorized users can register.

Developers cloning LinComms can still run the project using mock keys in `.env.example`.
