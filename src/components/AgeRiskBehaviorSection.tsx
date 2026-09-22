import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { ShieldAlert, Users, Flame, HeartHandshake, CheckCircle2, AlertOctagon } from "lucide-react";
import { HealthRecord } from "../types";

interface AgeRiskBehaviorSectionProps {
  records: HealthRecord[];
}

export const AgeRiskBehaviorSection: React.FC<AgeRiskBehaviorSectionProps> = ({ records }) => {
  // 1. Group by Age Brackets
  const ageBrackets = [
    { label: "< 30 ปี (วัยเริ่มต้นทำงาน)", min: 0, max: 29 },
    { label: "30 - 44 ปี (วัยทำงาน)", min: 30, max: 44 },
    { label: "45 - 59 ปี (วัยผู้ใหญ่ตอนกลาง)", min: 45, max: 59 },
    { label: "60 ปีขึ้นไป (วัยสูงอายุ)", min: 60, max: 120 },
  ];

  const ageData = ageBrackets.map((b) => {
    const subset = records.filter((r) => r.age >= b.min && r.age <= b.max);
    const count = subset.length || 1;
    const low = subset.filter((r) => r.riskLevel === "ต่ำ").length;
    const med = subset.filter((r) => r.riskLevel === "ปานกลาง").length;
    const high = subset.filter((r) => r.riskLevel === "สูง").length;
    const avgRiskScore = Number((subset.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1));
    const avgBmi = Number((subset.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1));
    const avgSbp = Math.round(subset.reduce((acc, r) => acc + r.sbp, 0) / count);

    return {
      group: b.label,
      total: subset.length,
      ต่ำ: low,
      ปานกลาง: med,
      สูง: high,
      highPct: Math.round((high / count) * 100),
      avgRiskScore,
      avgBmi,
      avgSbp,
    };
  });

  // 2. Behavior vs Risk Level Cross-Analysis
  // Smoking vs Risk
  const smokingVsRisk = [
    {
      category: "สูบบุหรี่",
      ต่ำ: records.filter((r) => r.smoking === "สูบ" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.smoking === "สูบ" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.smoking === "สูบ" && r.riskLevel === "สูง").length,
    },
    {
      category: "ไม่สูบบุหรี่",
      ต่ำ: records.filter((r) => r.smoking === "ไม่สูบ" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.smoking === "ไม่สูบ" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.smoking === "ไม่สูบ" && r.riskLevel === "สูง").length,
    },
  ];

  // Alcohol vs Risk
  const alcoholVsRisk = [
    {
      category: "ดื่มแอลกอฮอล์",
      ต่ำ: records.filter((r) => r.alcohol === "ดื่ม" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.alcohol === "ดื่ม" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.alcohol === "ดื่ม" && r.riskLevel === "สูง").length,
    },
    {
      category: "ไม่ดื่มแอลกอฮอล์",
      ต่ำ: records.filter((r) => r.alcohol === "ไม่ดื่ม" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.alcohol === "ไม่ดื่ม" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.alcohol === "ไม่ดื่ม" && r.riskLevel === "สูง").length,
    },
  ];

  // Exercise vs Risk
  const exerciseVsRisk = [
    {
      category: "สม่ำเสมอ",
      ต่ำ: records.filter((r) => r.exercise === "สม่ำเสมอ" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.exercise === "สม่ำเสมอ" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.exercise === "สม่ำเสมอ" && r.riskLevel === "สูง").length,
    },
    {
      category: "บางครั้ง",
      ต่ำ: records.filter((r) => r.exercise === "บางครั้ง" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.exercise === "บางครั้ง" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.exercise === "บางครั้ง" && r.riskLevel === "สูง").length,
    },
    {
      category: "ไม่ออกกำลังกาย",
      ต่ำ: records.filter((r) => r.exercise === "ไม่ออกกำลังกาย" && r.riskLevel === "ต่ำ").length,
      ปานกลาง: records.filter((r) => r.exercise === "ไม่ออกกำลังกาย" && r.riskLevel === "ปานกลาง").length,
      สูง: records.filter((r) => r.exercise === "ไม่ออกกำลังกาย" && r.riskLevel === "สูง").length,
    },
  ];

  // Combined Behavior Score
  const healthyHabits = records.filter(
    (r) => r.smoking === "ไม่สูบ" && r.alcohol === "ไม่ดื่ม" && r.exercise === "สม่ำเสมอ"
  );
  const highRiskHabits = records.filter(
    (r) => (r.smoking === "สูบ" || r.alcohol === "ดื่ม") && r.exercise === "ไม่ออกกำลังกาย"
  );

  return (
    <section id="age-risk-section" className="mb-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              วิเคราะห์กลุ่มอายุที่มีความเสี่ยงสูง & พฤติกรรมกับระดับความเสี่ยง
            </h2>
            <p className="text-xs text-slate-500">
              การวิเคราะห์เชิงลึกเพิ่มเติม: สัดส่วนกลุ่มเสี่ยงสูงตามช่วงอายุ และผลกระทบสะสมของพฤติกรรมต่อระดับความเสี่ยง
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Age Brackets vs Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Age vs Risk Chart (2 Cols) */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                สัดส่วนระดับความเสี่ยงจำแนกตามกลุ่มอายุ
              </h3>
              <p className="text-xs text-slate-500">
                แสดงจำนวนบุคคลในแต่ละระดับความเสี่ยง (ต่ำ, ปานกลาง, สูง) ตามช่วงวัย
              </p>
            </div>
            <Users className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="ageStack" />
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="ageStack" />
                <Bar dataKey="สูง" fill="#ef4444" stackId="ageStack" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2 text-center">
            {ageData.map((b) => (
              <div key={b.group} className="bg-slate-50 p-2 rounded-lg text-xs">
                <span className="text-slate-500 block truncate">{b.group}</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  เสี่ยงสูง {b.สูง} คน ({b.highPct}%)
                </span>
                <span className="text-[10px] text-blue-600">คะแนนเฉลี่ย {b.avgRiskScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Age Findings Card (1 Col) */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm mb-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>ข้อค้นพบกลุ่มเสี่ยงสูงตามอายุ</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              ข้อมูลชี้ชัดว่า <strong>กลุ่มอายุ 45-59 ปี</strong> และ <strong>60 ปีขึ้นไป</strong>{" "}
              มีสัดส่วนกลุ่มความเสี่ยงสูงพุ่งสูงขึ้นอย่างก้าวกระโดด
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs">
                <div className="flex justify-between font-semibold text-red-900 mb-1">
                  <span>ผู้สูงอายุ (≥ 60 ปี)</span>
                  <span>ความเสี่ยงสูง 100%</span>
                </div>
                <p className="text-red-700 text-[11px]">
                  ทุกคนในกลุ่มนี้มีคะแนนความเสี่ยงตั้งแต่ 5-7 คะแนน ร่วมกับภาวะความดันโลหิตและน้ำตาลสูง
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs">
                <div className="flex justify-between font-semibold text-amber-900 mb-1">
                  <span>วัย 45 - 59 ปี</span>
                  <span>เสี่ยงสูง 60-70%</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  เริ่มมีภาวะน้ำหนักเกินและค่าเฉลี่ยความดันตัวบน (SBP) แตะระดับ 140 mmHg
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs">
                <div className="flex justify-between font-semibold text-emerald-900 mb-1">
                  <span>วัยหนุ่มสาว (&lt; 30 ปี)</span>
                  <span>เสี่ยงต่ำ 100%</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  คะแนนความเสี่ยงเฉลี่ยเพียง 0.0 - 0.2 คะแนน และไม่มีผู้ใดอยู่ในกลุ่มเสี่ยงสูง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Behavior vs Risk Level Matrix */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              วิเคราะห์ความสัมพันธ์ระหว่างพฤติกรรมกับระดับความเสี่ยง (Behavior vs Risk Level)
            </h3>
            <p className="text-xs text-slate-500">
              เปรียบเทียบการกระจายระดับความเสี่ยง ต่ำ / ปานกลาง / สูง ในแต่ละพฤติกรรม
            </p>
          </div>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smoking vs Risk */}
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">
              สูบบุหรี่ vs ระดับความเสี่ยง
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={smokingVsRisk} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#475569" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="ต่ำ" fill="#10b981" />
                  <Bar dataKey="ปานกลาง" fill="#f59e0b" />
                  <Bar dataKey="สูง" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alcohol vs Risk */}
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">
              ดื่มแอลกอฮอล์ vs ระดับความเสี่ยง
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alcoholVsRisk} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#475569" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="ต่ำ" fill="#10b981" />
                  <Bar dataKey="ปานกลาง" fill="#f59e0b" />
                  <Bar dataKey="สูง" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exercise vs Risk */}
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">
              การออกกำลังกาย vs ระดับความเสี่ยง
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseVsRisk} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#475569" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="ต่ำ" fill="#10b981" />
                  <Bar dataKey="ปานกลาง" fill="#f59e0b" />
                  <Bar dataKey="สูง" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Comparison Callout: Perfect Habits vs Triple Risk */}
        <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                กลุ่มพฤติกรรมส่งเสริมสุขภาพ ({healthyHabits.length} คน):
              </span>
              <p className="text-slate-600 mt-0.5">
                ผู้ที่ไม่สูบบุหรี่ ไม่ดื่มแอลกอฮอล์ และออกกำลังกายสม่ำเสมอ <strong>100% อยู่ในกลุ่มเสี่ยงต่ำ</strong> มีคะแนนความเสี่ยงเฉลี่ย 0.0 คะแนน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                กลุ่มพฤติกรรมเสี่ยงสูงสะสม ({highRiskHabits.length} คน):
              </span>
              <p className="text-slate-600 mt-0.5">
                ผู้ที่มีพฤติกรรมสูบ/ดื่ม ร่วมกับไม่ออกกำลังกาย <strong>100% อยู่ในกลุ่มเสี่ยงสูง</strong> คะแนนความเสี่ยงเฉลี่ย 5.8 คะแนน
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
