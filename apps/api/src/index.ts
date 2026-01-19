import cors from "cors";
import express from "express";
import pino from "pino";

const log = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" }
        }
      : undefined
});

const app = express();
app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "adneo-api" });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  log.info({ port }, "API listening");
});

