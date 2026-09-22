import { HealthRecord } from "../types";

export const SHEET_ID = "1NP9UlFb_pFjFcBvzned4Wzz397Wh48CkX--insZAa7Q";
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function parseCSVLine(line: string): string[] {
  return line
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map((s) => s.replace(/^"|"$/g, "").trim());
}

export function parseSheetCsvToRecords(csvText: string): HealthRecord[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return [];
  }

  const dataRows = lines.slice(1).map(parseCSVLine);
  return dataRows
    .map((r) => {
      const rawRisk = (r[18] || "").trim().replace(/\u0E39+/g, "\u0E39");
      const riskLevel = rawRisk.includes("สูง")
        ? "สูง"
        : rawRisk.includes("ปานกลาง")
        ? "ปานกลาง"
        : "ต่ำ";

      const rawEx = (r[14] || "").trim();
      const exercise = rawEx.includes("สม่ำเสมอ")
        ? "สม่ำเสมอ"
        : rawEx.includes("ไม่ออก")
        ? "ไม่ออกกำลังกาย"
        : "บางครั้ง";

      const rawSmoke = (r[12] || "").trim();
      const smoking = rawSmoke.includes("ไม่สูบ") ? "ไม่สูบ" : rawSmoke.includes("สูบ") ? "สูบ" : "ไม่สูบ";

      const rawAlc = (r[13] || "").trim();
      const alcohol = rawAlc.includes("ไม่ดื่ม") ? "ไม่ดื่ม" : rawAlc.includes("ดื่ม") ? "ดื่ม" : "ไม่ดื่ม";

      const rawDm = (r[15] || "").trim();
      const diabetesScreening = rawDm.includes("ไม่มี")
        ? "ไม่มี"
        : rawDm.includes("เสี่ยง") || rawDm.includes("มีแนวโน้ม")
        ? "มีแนวโน้ม/เสี่ยง"
        : "ไม่มี";

      const rawHt = (r[16] || "").trim();
      const hypertensionScreening = rawHt.includes("ไม่มี")
        ? "ไม่มี"
        : rawHt.includes("เสี่ยง") || rawHt.includes("มีแนวโน้ม")
        ? "มีแนวโน้ม/เสี่ยง"
        : "ไม่มี";

      return {
        id: (r[0] || "").trim(),
        screeningDate: (r[1] || "").trim(),
        area: (r[2] || "").trim(),
        gender: (r[3] || "").trim(),
        age: Number(r[4]) || 0,
        heightCm: Number(r[5]) || 0,
        weightKg: Number(r[6]) || 0,
        bmi: Number(r[7]) || 0,
        sbp: Number(r[8]) || 0,
        dbp: Number(r[9]) || 0,
        pulseBpm: Number(r[10]) || 0,
        bloodSugar: Number(r[11]) || 0,
        smoking,
        alcohol,
        exercise,
        diabetesScreening,
        hypertensionScreening,
        riskScore: Number(r[17]) || 0,
        riskLevel,
        month: (r[19] || "").trim(),
      };
    })
    .filter((r) => r.id && r.id.trim() !== "");
}

/**
 * Fetch records using hybrid strategy:
 * 1. Try local server API endpoint `/api/health-data`
 * 2. If running on GitHub Pages / Static host (where /api doesn't exist), fetch directly from Google Sheets
 */
export async function fetchHealthRecordsLive(): Promise<{
  records: HealthRecord[];
  source: string;
}> {
  // Try server endpoint first
  try {
    const res = await fetch(`/api/health-data?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.records) && data.records.length > 0) {
        return { records: data.records, source: "server_proxy" };
      }
    }
  } catch (e) {
    // Expected on static hosting like GitHub Pages
  }

  // Fallback to direct client-side fetch from Google Sheets (works on GitHub Pages / Vercel / Netlify)
  const directRes = await fetch(`${SHEET_CSV_URL}&_t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!directRes.ok) {
    throw new Error(`Google Sheet request failed with status: ${directRes.status}`);
  }
  const csv = await directRes.text();
  const records = parseSheetCsvToRecords(csv);
  return { records, source: "google_sheet_direct" };
}
