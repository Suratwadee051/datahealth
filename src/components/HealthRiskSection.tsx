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
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { HeartPulse, Info, Activity, Gauge, Flame, AlertCircle } from "lucide-react";
import { HealthRecord } from "../types";

interface HealthRiskSectionProps {
  records: HealthRecord[];
}

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  // 1. Group by Risk Level and calculate averages for BMI, SBP, DBP, Sugar
  const riskGroups = ["ต่ำ", "ปานกลาง", "สูง"];
  const avgByRisk = riskGroups.map((level) => {
    const group = records.filter((r) => r.riskLevel === level);
    const count = group.length || 1;
    const avgBmi = Number((group.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1));
    const avgSbp = Math.round(group.reduce((acc, r) => acc + r.sbp, 0) / count);
    const avgDbp = Math.round(group.reduce((acc, r) => acc + r.dbp, 0) / count);
    const avgSugar = Math.round(group.reduce((acc, r) => acc + r.bloodSugar, 0) / count);

    return {
      name: `ความเสี่ยง${level}`,
      level,
      count: group.length,
      BMI: avgBmi,
      "ความดันตัวบน (SBP)": avgSbp,
      "ความดันตัวล่าง (DBP)": avgDbp,
      "น้ำตาล (mg/dL)": avgSugar,
    };
  });

  // 2. Scatter plot data: SBP vs DBP with BMI and Sugar
  const scatterDataLow = records
    .filter((r) => r.riskLevel === "ต่ำ")
    .map((r) => ({
      x: r.sbp,
      y: r.dbp,
      z: r.bmi,
      sugar: r.bloodSugar,
      id: r.id,
      age: r.age,
      level: "ต่ำ",
    }));

  const scatterDataMed = records
    .filter((r) => r.riskLevel === "ปานกลาง")
    .map((r) => ({
      x: r.sbp,
      y: r.dbp,
      z: r.bmi,
      sugar: r.bloodSugar,
      id: r.id,
      age: r.age,
      level: "ปานกลาง",
    }));

  const scatterDataHigh = records
    .filter((r) => r.riskLevel === "สูง")
    .map((r) => ({
      x: r.sbp,
      y: r.dbp,
      z: r.bmi,
      sugar: r.bloodSugar,
      id: r.id,
      age: r.age,
      level: "สูง",
    }));

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">
            {data.id} (อายุ {data.age} ปี)
          </p>
          <p className="text-slate-600">
            ความดันโลหิต:{" "}
            <span className="font-semibold text-blue-700">
              {data.x}/{data.y} mmHg
            </span>
          </p>
          <p className="text-slate-600">
            BMI: <span className="font-semibold text-slate-800">{data.z}</span>
          </p>
          <p className="text-slate-600">
            น้ำตาลในเลือด:{" "}
            <span className="font-semibold text-amber-600">{data.sugar} mg/dL</span>
          </p>
          <p className="text-slate-600">
            ระดับความเสี่ยง:{" "}
            <span
              className={`font-semibold ${
                data.level === "สูง"
                  ? "text-red-600"
                  : data.level === "ปานกลาง"
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {data.level}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="health-risk-section" className="mb-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              การวิเคราะห์ความเสี่ยงด้านสุขภาพ (Health Risk)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ตัวชี้วัดสำคัญ 4 ปัจจัย: BMI, SBP (ความดันตัวบน), DBP (ความดันตัวล่าง) และ ปริมาณน้ำตาลในเลือด
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Grouped Bar Chart comparing clinical markers across risk levels */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                เปรียบเทียบค่าเฉลี่ยตัวชี้วัดแยกตามระดับความเสี่ยง
              </h3>
              <p className="text-xs text-slate-500">
                ค่าเฉลี่ย SBP, DBP, น้ำตาล และ BMI ในแต่ละกลุ่มความเสี่ยง
              </p>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Field: SBP, DBP, น้ำตาล
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgByRisk} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="ความดันตัวบน (SBP)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="น้ำตาล (mg/dL)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ความดันตัวล่าง (DBP)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>ข้อสังเกต:</strong> กลุ่มความเสี่ยงสูงมีค่าเฉลี่ยความดันตัวบน (SBP) สูงถึง ~149 mmHg
              และระดับน้ำตาลเฉลี่ยสูงถึง ~135 mg/dL ซึ่งเกินเกณฑ์ปกติอย่างมีนัยสำคัญ
            </span>
          </div>
        </div>

        {/* Chart 2: Blood Pressure Distribution (SBP vs DBP) with Clinical Thresholds */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                การกระจายตัวความดันโลหิต (SBP vs DBP) และความเสี่ยง
              </h3>
              <p className="text-xs text-slate-500">
                เส้นประสีแดงแสดงเกณฑ์ความดันโลหิตสูง (≥ 140/90 mmHg)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> ต่ำ
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> ปานกลาง
              </span>
              <span className="flex items-center gap-1 text-red-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> สูง
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="SBP"
                  unit=" mmHg"
                  domain={[100, 170]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{ value: "ความดันตัวบน SBP (mmHg)", position: "insideBottom", offset: -12, fontSize: 11, fill: "#475569" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="DBP"
                  unit=" mmHg"
                  domain={[60, 110]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{ value: "ความดันตัวล่าง DBP (mmHg)", angle: -90, position: "insideLeft", offset: 15, fontSize: 11, fill: "#475569" }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 140]} name="BMI" />
                <Tooltip content={<CustomScatterTooltip />} />
                {/* Clinical Warning Lines */}
                <ReferenceLine x={140} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "เกณฑ์สูง 140", fill: "#ef4444", fontSize: 10, position: "insideTopLeft" }} />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "เกณฑ์สูง 90", fill: "#ef4444", fontSize: 10, position: "insideRight" }} />
                <Scatter name="เสี่ยงต่ำ" data={scatterDataLow} fill="#10b981" opacity={0.85} />
                <Scatter name="เสี่ยงปานกลาง" data={scatterDataMed} fill="#f59e0b" opacity={0.85} />
                <Scatter name="เสี่ยงสูง" data={scatterDataHigh} fill="#ef4444" opacity={0.9} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 bg-blue-50/60 rounded-lg text-xs text-slate-700 flex items-center justify-between border border-blue-100">
            <span><strong>ขนาดจุด:</strong> แปรผันตามค่า BMI ของแต่ละบุคคล</span>
            <span className="text-slate-500">เขตขวาบน = ภาวะความดันโลหิตสูงและเสี่ยงวิกฤต</span>
          </div>
        </div>
      </div>

      {/* 4 Clinical Marker Summary Strips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* BMI summary strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>เกณฑ์ค่า BMI</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            BMI &gt; 25.0 สัมพันธ์อย่างยิ่งกับความเสี่ยงระดับสูงและความดันโลหิตที่เพิ่มขึ้น
          </p>
        </div>

        {/* SBP summary strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span>ความดันตัวบน (SBP)</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ผู้มีความเสี่ยงสูงมี SBP เกิน 140 mmHg ในทุกรายที่ทำการคัดกรอง
          </p>
        </div>

        {/* DBP summary strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
            <HeartPulse className="w-4 h-4 text-indigo-600" />
            <span>ความดันตัวล่าง (DBP)</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ค่า DBP ในกลุ่มเสี่ยงสูงเฉลี่ย 92 mmHg จัดอยู่ในเกณฑ์ความดันโลหิตสูงระดับ 2
          </p>
        </div>

        {/* Sugar summary strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>น้ำตาลในเลือด</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ตรวจพบระดับน้ำตาลตั้งแต่ 126 mg/dL ขึ้นไป ในกลุ่มที่มีความเสี่ยงสูง
          </p>
        </div>
      </div>
    </section>
  );
};
