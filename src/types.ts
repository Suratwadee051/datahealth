export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่ (เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้)
  gender: string; // เพศ (ชาย, หญิง)
  age: number; // อายุ
  heightCm: number; // ส่วนสูง_cm
  weightKg: number; // น้ำหนัก_kg
  bmi: number; // BMI
  sbp: number; // SBP_mmHg
  dbp: number; // DBP_mmHg
  pulseBpm: number; // ชีพจร_bpm
  bloodSugar: number; // น้ำตาล_mg_dL
  smoking: string; // สูบบุหรี่ (สูบ, ไม่สูบ)
  alcohol: string; // ดื่มแอลกอฮอล์ (ดื่ม, ไม่ดื่ม)
  exercise: string; // การออกกำลังกาย (สม่ำเสมอ, บางครั้ง, ไม่ออกกำลังกาย)
  diabetesScreening: string; // เบาหวาน_คัดกรอง (ไม่มี, มีแนวโน้ม/เสี่ยง)
  hypertensionScreening: string; // ความดันโลหิตสูง_คัดกรอง (ไม่มี, มีแนวโน้ม/เสี่ยง)
  riskScore: number; // คะแนนความเสี่ยง
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01
}

export type RiskLevelType = 'ต่ำ' | 'ปานกลาง' | 'สูง';

export interface FilterState {
  personId: string;
  area: string;
  riskLevel: string;
  searchQuery: string;
}

export interface KpiSummary {
  totalCount: number;
  avgBmi: number;
  bmiCategoryBreakdown: {
    normal: number; // 18.5 - 22.9
    overweight: number; // 23 - 24.9
    obese: number; // >= 25
    underweight: number; // < 18.5
  };
  avgPulse: number;
  minPulse: number;
  maxPulse: number;
  avgBloodSugar: number;
  highSugarCount: number;
  avgRiskScore: number;
  highRiskCount: number;
  highRiskPercentage: number;
  moderateRiskCount: number;
  lowRiskCount: number;
}
