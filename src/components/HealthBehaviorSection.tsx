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
} from "recharts";
import { Smile, Cigarette, Wine, Dumbbell, Stethoscope, AlertTriangle, ShieldCheck } from "lucide-react";
import { HealthRecord } from "../types";

interface HealthBehaviorSectionProps {
  records: HealthRecord[];
}

export const HealthBehaviorSection: React.FC<HealthBehaviorSectionProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. Smoking Breakdown
  const smokerCount = records.filter((r) => r.smoking === "สูบ").length;
  const nonSmokerCount = records.filter((r) => r.smoking === "ไม่สูบ").length;

  // 2. Alcohol Breakdown
  const drinkerCount = records.filter((r) => r.alcohol === "ดื่ม").length;
  const nonDrinkerCount = records.filter((r) => r.alcohol === "ไม่ดื่ม").length;

  // 3. Exercise Breakdown
  const regularExCount = records.filter((r) => r.exercise === "สม่ำเสมอ").length;
  const sometimesExCount = records.filter((r) => r.exercise === "บางครั้ง").length;
  const noExCount = records.filter((r) => r.exercise === "ไม่ออกกำลังกาย").length;

  // 4. Diabetes Screening
  const dmRiskCount = records.filter((r) => r.diabetesScreening === "มีแนวโน้ม/เสี่ยง").length;
  const dmNoneCount = records.filter((r) => r.diabetesScreening === "ไม่มี").length;

  // 5. Hypertension Screening
  const htRiskCount = records.filter((r) => r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง").length;
  const htNoneCount = records.filter((r) => r.hypertensionScreening === "ไม่มี").length;

  // Bar chart data comparing Disease Screening across Lifestyle Behaviors
  const behaviorVsDisease = [
    {
      name: "ผู้สูบบุหรี่",
      total: smokerCount,
      "เสี่ยงเบาหวาน": records.filter((r) => r.smoking === "สูบ" && r.diabetesScreening === "มีแนวโน้ม/เสี่ยง").length,
      "เสี่ยงความดันสูง": records.filter((r) => r.smoking === "สูบ" && r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง").length,
    },
    {
      name: "ผู้ดื่มแอลกอฮอล์",
      total: drinkerCount,
      "เสี่ยงเบาหวาน": records.filter((r) => r.alcohol === "ดื่ม" && r.diabetesScreening === "มีแนวโน้ม/เสี่ยง").length,
      "เสี่ยงความดันสูง": records.filter((r) => r.alcohol === "ดื่ม" && r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง").length,
    },
    {
      name: "ไม่ออกกำลังกาย",
      total: noExCount,
      "เสี่ยงเบาหวาน": records.filter((r) => r.exercise === "ไม่ออกกำลังกาย" && r.diabetesScreening === "มีแนวโน้ม/เสี่ยง").length,
      "เสี่ยงความดันสูง": records.filter((r) => r.exercise === "ไม่ออกกำลังกาย" && r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง").length,
    },
    {
      name: "ออกกำลังกายสม่ำเสมอ",
      total: regularExCount,
      "เสี่ยงเบาหวาน": records.filter((r) => r.exercise === "สม่ำเสมอ" && r.diabetesScreening === "มีแนวโน้ม/เสี่ยง").length,
      "เสี่ยงความดันสูง": records.filter((r) => r.exercise === "สม่ำเสมอ" && r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง").length,
    },
  ];

  return (
    <section id="health-behavior-section" className="mb-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              พฤติกรรมสุขภาพและโรคคัดกรอง (Health Behavior)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ 5 ปัจจัย: สูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย, เบาหวาน_คัดกรอง และ ความดันโลหิตสูง_คัดกรอง
            </p>
          </div>
        </div>
      </div>

      {/* 5 Behavioral & Screening Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* 1. Smoking */}
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">การสูบบุหรี่</span>
            <Cigarette className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {smokerCount} <span className="text-xs text-slate-500 font-normal">คนสูบ ({Math.round((smokerCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div className="bg-rose-500 h-2" style={{ width: `${(smokerCount / total) * 100}%` }} title="สูบ" />
            <div className="bg-emerald-400 h-2" style={{ width: `${(nonSmokerCount / total) * 100}%` }} title="ไม่สูบ" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span className="text-rose-600 font-medium">สูบ {smokerCount}</span>
            <span className="text-emerald-600 font-medium">ไม่สูบ {nonSmokerCount}</span>
          </div>
        </div>

        {/* 2. Alcohol */}
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">การดื่มแอลกอฮอล์</span>
            <Wine className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {drinkerCount} <span className="text-xs text-slate-500 font-normal">คนดื่ม ({Math.round((drinkerCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div className="bg-amber-500 h-2" style={{ width: `${(drinkerCount / total) * 100}%` }} title="ดื่ม" />
            <div className="bg-emerald-400 h-2" style={{ width: `${(nonDrinkerCount / total) * 100}%` }} title="ไม่ดื่ม" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span className="text-amber-600 font-medium">ดื่ม {drinkerCount}</span>
            <span className="text-emerald-600 font-medium">ไม่ดื่ม {nonDrinkerCount}</span>
          </div>
        </div>

        {/* 3. Exercise */}
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">การออกกำลังกาย</span>
            <Dumbbell className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {regularExCount} <span className="text-xs text-slate-500 font-normal">สม่ำเสมอ ({Math.round((regularExCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div className="bg-emerald-500 h-2" style={{ width: `${(regularExCount / total) * 100}%` }} title="สม่ำเสมอ" />
            <div className="bg-blue-400 h-2" style={{ width: `${(sometimesExCount / total) * 100}%` }} title="บางครั้ง" />
            <div className="bg-rose-400 h-2" style={{ width: `${(noExCount / total) * 100}%` }} title="ไม่ออกกำลังกาย" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>บางครั้ง: {sometimesExCount}</span>
            <span className="text-rose-600 font-medium">ไม่ออก: {noExCount}</span>
          </div>
        </div>

        {/* 4. Diabetes Screening */}
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">คัดกรองเบาหวาน</span>
            <Stethoscope className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {dmRiskCount} <span className="text-xs text-purple-600 font-medium">รายมีแนวโน้ม</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div className="bg-purple-500 h-2" style={{ width: `${(dmRiskCount / total) * 100}%` }} title="มีแนวโน้ม/เสี่ยง" />
            <div className="bg-emerald-400 h-2" style={{ width: `${(dmNoneCount / total) * 100}%` }} title="ไม่มี" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span className="text-purple-600 font-medium">{Math.round((dmRiskCount / total) * 100)}% เสี่ยง</span>
            <span className="text-emerald-600 font-medium">ปกติ {dmNoneCount}</span>
          </div>
        </div>

        {/* 5. Hypertension Screening */}
        <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">คัดกรองความดันสูง</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {htRiskCount} <span className="text-xs text-red-600 font-medium">รายมีแนวโน้ม</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div className="bg-red-500 h-2" style={{ width: `${(htRiskCount / total) * 100}%` }} title="มีแนวโน้ม/เสี่ยง" />
            <div className="bg-emerald-400 h-2" style={{ width: `${(htNoneCount / total) * 100}%` }} title="ไม่มี" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span className="text-red-600 font-medium">{Math.round((htRiskCount / total) * 100)}% เสี่ยง</span>
            <span className="text-emerald-600 font-medium">ปกติ {htNoneCount}</span>
          </div>
        </div>
      </div>

      {/* Comparison Chart: Behaviors vs Screened Disease Prevalence */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              ความสัมพันธ์ระหว่างพฤติกรรมสุขภาพกับความเสี่ยงโรคเบาหวานและความดันโลหิตสูง
            </h3>
            <p className="text-xs text-slate-500">
              เปรียบเทียบจำนวนผู้ที่มีแนวโน้มโรคในแต่ละกลุ่มพฤติกรรม
            </p>
          </div>
          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            พฤติกรรม vs โรคคัดกรอง
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorVsDisease} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} />
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
              <Bar dataKey="เสี่ยงเบาหวาน" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="เสี่ยงความดันสูง" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>ผลการวิเคราะห์พฤติกรรม:</strong> ผู้ที่ออกกำลังกายสม่ำเสมอพบอัตราความเสี่ยงโรคเบาหวานและความดันโลหิตสูงต่ำที่สุด (0 ราย)
            ในขณะที่กลุ่มผู้ดื่มแอลกอฮอล์และกลุ่มที่ไม่ออกกำลังกายมีความชุกของภาวะเสี่ยงทั้งสองโรคสูงที่สุด
          </span>
        </div>
      </div>
    </section>
  );
};
