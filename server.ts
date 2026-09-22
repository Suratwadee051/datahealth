import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const SHEET_ID = "1NP9UlFb_pFjFcBvzned4Wzz397Wh48CkX--insZAa7Q";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function parseCSVLine(line: string): string[] {
  return line
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map((s) => s.replace(/^"|"$/g, "").trim());
}

async function fetchSheetData() {
  const response = await fetch(SHEET_CSV_URL, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
  }

  const text = await response.text();
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return [];
  }

  const dataRows = lines.slice(1).map(parseCSVLine);
  return dataRows
    .map((r) => ({
      id: r[0] || "",
      screeningDate: r[1] || "",
      area: r[2] || "",
      gender: r[3] || "",
      age: Number(r[4]) || 0,
      heightCm: Number(r[5]) || 0,
      weightKg: Number(r[6]) || 0,
      bmi: Number(r[7]) || 0,
      sbp: Number(r[8]) || 0,
      dbp: Number(r[9]) || 0,
      pulseBpm: Number(r[10]) || 0,
      bloodSugar: Number(r[11]) || 0,
      smoking: r[12] || "",
      alcohol: r[13] || "",
      exercise: r[14] || "",
      diabetesScreening: r[15] || "",
      hypertensionScreening: r[16] || "",
      riskScore: Number(r[17]) || 0,
      riskLevel: r[18] || "ต่ำ",
      month: r[19] || "",
    }))
    .filter((r) => r.id && r.id.trim() !== "");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/health-data", async (_req, res) => {
    try {
      const records = await fetchSheetData();
      res.json({
        success: true,
        source: "google_sheet_live",
        sheetId: SHEET_ID,
        updatedAt: new Date().toISOString(),
        totalCount: records.length,
        records,
      });
    } catch (err: any) {
      console.error("Error fetching live sheet:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to fetch Google Sheet",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
