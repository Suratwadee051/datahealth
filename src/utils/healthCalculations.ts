import { HealthRecord, KpiSummary } from "../types";

export function calculateKpi(records: HealthRecord[]): KpiSummary {
  if (records.length === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      bmiCategoryBreakdown: { normal: 0, overweight: 0, obese: 0, underweight: 0 },
      avgPulse: 0,
      minPulse: 0,
      maxPulse: 0,
      avgBloodSugar: 0,
      highSugarCount: 0,
      avgRiskScore: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
    };
  }

  const total = records.length;
  let sumBmi = 0;
  let normalBmi = 0;
  let overweightBmi = 0;
  let obeseBmi = 0;
  let underweightBmi = 0;

  let sumPulse = 0;
  let minPulse = records[0].pulseBpm;
  let maxPulse = records[0].pulseBpm;

  let sumSugar = 0;
  let highSugar = 0;

  let sumRisk = 0;
  let highRisk = 0;
  let moderateRisk = 0;
  let lowRisk = 0;

  records.forEach((r) => {
    // BMI
    sumBmi += r.bmi;
    if (r.bmi < 18.5) underweightBmi++;
    else if (r.bmi <= 22.9) normalBmi++;
    else if (r.bmi <= 24.9) overweightBmi++;
    else obeseBmi++;

    // Pulse
    sumPulse += r.pulseBpm;
    if (r.pulseBpm < minPulse) minPulse = r.pulseBpm;
    if (r.pulseBpm > maxPulse) maxPulse = r.pulseBpm;

    // Sugar
    sumSugar += r.bloodSugar;
    if (r.bloodSugar >= 126) highSugar++;

    // Risk
    sumRisk += r.riskScore;
    if (r.riskLevel === "สูง") highRisk++;
    else if (r.riskLevel === "ปานกลาง") moderateRisk++;
    else lowRisk++;
  });

  return {
    totalCount: total,
    avgBmi: Number((sumBmi / total).toFixed(1)),
    bmiCategoryBreakdown: {
      normal: normalBmi,
      overweight: overweightBmi,
      obese: obeseBmi,
      underweight: underweightBmi,
    },
    avgPulse: Math.round(sumPulse / total),
    minPulse,
    maxPulse,
    avgBloodSugar: Number((sumSugar / total).toFixed(1)),
    highSugarCount: highSugar,
    avgRiskScore: Number((sumRisk / total).toFixed(1)),
    highRiskCount: highRisk,
    highRiskPercentage: Number(((highRisk / total) * 100).toFixed(1)),
    moderateRiskCount: moderateRisk,
    lowRiskCount: lowRisk,
  };
}

// Color badges for risk levels
export function getRiskLevelBadge(level: string) {
  switch (level) {
    case "สูง":
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        indicator: "bg-red-500",
        label: "ความเสี่ยงสูง",
        colorClass: "text-red-600",
      };
    case "ปานกลาง":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        indicator: "bg-amber-500",
        label: "ความเสี่ยงปานกลาง",
        colorClass: "text-amber-600",
      };
    case "ต่ำ":
    default:
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        indicator: "bg-emerald-500",
        label: "ความเสี่ยงต่ำ",
        colorClass: "text-emerald-600",
      };
  }
}

// Color coding for clinical indicators (เขียว, เหลือง, ส้ม, แดง)
export function getBmiStatus(bmi: number) {
  if (bmi < 18.5) {
    return { label: "น้ำหนักน้อยกว่าเกณฑ์", color: "text-sky-700 bg-sky-50 border-sky-200", level: "info" };
  } else if (bmi <= 22.9) {
    return { label: "น้ำหนักปกติ (สมส่วน)", color: "text-emerald-700 bg-emerald-50 border-emerald-200", level: "green" };
  } else if (bmi <= 24.9) {
    return { label: "น้ำหนักเกิน (ท้วม)", color: "text-amber-700 bg-amber-50 border-amber-200", level: "yellow" };
  } else if (bmi <= 29.9) {
    return { label: "โรคอ้วนระดับ 1", color: "text-orange-700 bg-orange-50 border-orange-200", level: "orange" };
  } else {
    return { label: "โรคอ้วนระดับ 2 (อันตราย)", color: "text-red-700 bg-red-50 border-red-200", level: "red" };
  }
}

export function getBloodPressureStatus(sbp: number, dbp: number) {
  if (sbp < 120 && dbp < 80) {
    return { label: "ความดันปกติ", color: "text-emerald-700 bg-emerald-50 border-emerald-200", level: "green" };
  } else if (sbp <= 129 && dbp < 80) {
    return { label: "ความดันเริ่มสูง (เฝ้าระวัง)", color: "text-yellow-700 bg-yellow-50 border-yellow-200", level: "yellow" };
  } else if ((sbp >= 130 && sbp <= 139) || (dbp >= 80 && dbp <= 89)) {
    return { label: "ความดันสูงระยะที่ 1", color: "text-orange-700 bg-orange-50 border-orange-200", level: "orange" };
  } else {
    return { label: "ความดันสูงระยะที่ 2", color: "text-red-700 bg-red-50 border-red-200", level: "red" };
  }
}

export function getBloodSugarStatus(sugar: number) {
  if (sugar < 100) {
    return { label: "น้ำตาลปกติ (<100)", color: "text-emerald-700 bg-emerald-50 border-emerald-200", level: "green" };
  } else if (sugar <= 125) {
    return { label: "ภาวะเสี่ยงเบาหวาน (100-125)", color: "text-amber-700 bg-amber-50 border-amber-200", level: "yellow" };
  } else {
    return { label: "ระดับเบาหวาน (≥126)", color: "text-red-700 bg-red-50 border-red-200", level: "red" };
  }
}

export function formatThaiDateTime(date: Date): string {
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year} เวลา ${hours}:${minutes}:${seconds} น.`;
}
