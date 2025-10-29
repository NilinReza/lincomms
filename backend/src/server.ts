import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();


app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`[lincomms] API listening on :${port}`);
});

export default app;
