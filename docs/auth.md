# Authentication Flow

LinComms implements **JWT-based authentication** with role enforcement.

## Registration
1. Admin generates an invite token.
2. New user signs up using the invite token.
3. Backend validates token → assigns role → creates user with hashed password.

## Login
1. User submits email + password.
2. Password is verified using bcrypt.
3. A JWT is issued with role embedded in payload.

## Authorization
- **Admin routes**: restricted to JWTs with `role=ADMIN`.
- **Member routes**: accessible to all authenticated users.

## Token Lifecycle
- Access tokens: short-lived (e.g., 15m).
- Refresh tokens: long-lived, stored securely, can issue new access tokens.

## Logout
- Refresh token is invalidated (server-side blacklist or DB token revocation).
