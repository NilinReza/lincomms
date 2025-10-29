import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, inviteToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Signup successful! Token: ${data.token}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Request failed: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        />
        <input
          type="text"
          placeholder="Invite Token"
          value={inviteToken}
          required
          onChange={(e) => setInviteToken(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        />
        <button type="submit" style={{ padding: 10, width: "100%" }}>Sign Up</button>
      </form>

      {message && (
        <div style={{ marginTop: 20, fontWeight: "bold" }}>
          {message}
        </div>
      )}
    </div>
  );
}
