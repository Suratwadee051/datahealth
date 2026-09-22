import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, AlertTriangle, ShieldCheck, Calendar, BarChart3 } from "lucide-react";
import { HealthRecord } from "../types";

interface HealthTrendSectionProps {
  records: HealthRecord[];
}

export const HealthTrendSection: React.FC<HealthTrendSectionProps> = ({ records }) => {
  // 1. Chronological trend: sort by screeningDate
  const sortedRecords = [...records].sort((a, b) => {
    const parseD = (s: string) => {
      const parts = s.split("/");
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
      }
      return 0;
    };
    return parseD(a.screeningDate) - parseD(b.screeningDate);
  });

  const trendData = sortedRecords.map((r, idx) => ({
    index: idx + 1,
    id: r.id,
    date: r.screeningDate,
    คะแนนความเสี่ยง: r.riskScore,
    ระดับ: r.riskLevel,
  }));

  // 2. Risk score distribution (0 through 7+)
  const scoreCounts: Record<number, number> = {};
  records.forEach((r) => {
    scoreCounts[r.riskScore] = (scoreCounts[r.riskScore] || 0) + 1;
  });

  const scoreDistData = Object.keys(scoreCounts)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
    .map((score) => ({
      score: `คะแนน ${score}`,
      จำนวนคน: scoreCounts[score],
      level: score >= 4 ? "สูง" : score >= 2 ? "ปานกลาง" : "ต่ำ",
    }));

  // 3. Risk Level Share (Pie / Donut chart)
  const lowCount = records.filter((r) => r.riskLevel === "ต่ำ").length;
  const medCount = records.filter((r) => r.riskLevel === "ปานกลาง").length;
  const highCount = records.filter((r) => r.riskLevel === "สูง").length;

  const riskPieData = [
    { name: "ความเสี่ยงต่ำ", value: lowCount, color: "#10b981", percent: Math.round((lowCount / (records.length || 1)) * 100) },
    { name: "ความเสี่ยงปานกลาง", value: medCount, color: "#f59e0b", percent: Math.round((medCount / (records.length || 1)) * 100) },
    { name: "ความเสี่ยงสูง", value: highCount, color: "#ef4444", percent: Math.round((highCount / (records.length || 1)) * 100) },
  ];

  // 4. Monthly Cohort Trend
  const monthMap: Record<string, { month: string; ต่ำ: number; ปานกลาง: number; สูง: number; avgScore: number; sum: number; count: number }> = {};
  records.forEach((r) => {
    const m = r.month || "2026-01";
    if (!monthMap[m]) {
      monthMap[m] = { month: m, ต่ำ: 0, ปานกลาง: 0, สูง: 0, avgScore: 0, sum: 0, count: 0 };
    }
    if (r.riskLevel === "สูง") monthMap[m].สูง++;
    else if (r.riskLevel === "ปานกลาง") monthMap[m].ปานกลาง++;
    else monthMap[m].ต่ำ++;

    monthMap[m].sum += r.riskScore;
    monthMap[m].count++;
  });

  const monthTrendData = Object.values(monthMap).map((item) => ({
    ...item,
    avgScore: Number((item.sum / item.count).toFixed(2)),
  }));

  return (
    <section id="health-trend-section" className="mb-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              แนวโน้มสุขภาพและคะแนนความเสี่ยง (Health Trend)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์แนวโน้มคะแนนความเสี่ยง (Risk Score) และการกระจายตัวของระดับความเสี่ยงตามลำดับเวลา
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                แนวโน้มคะแนนความเสี่ยงรายบุคคลตามลำดับการคัดกรอง
              </h3>
              <p className="text-xs text-slate-500">
                คะแนนความเสี่ยง 0 - 7 แสดงเกณฑ์ความรุนแรงของภาวะเสี่ยง
              </p>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Field: คะแนนความเสี่ยง
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="riskScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="id" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 8]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-slate-800">
                            {data.id} ({data.date})
                          </p>
                          <p className="text-blue-600 font-semibold">
                            คะแนนความเสี่ยง: {data.คะแนนความเสี่ยง} คะแนน
                          </p>
                          <p className="text-slate-600">ระดับความเสี่ยง: {data.ระดับ}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="คะแนนความเสี่ยง"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskScoreGrad)"
                  dot={{ r: 3, fill: "#2563eb", strokeWidth: 1, stroke: "#ffffff" }}
                  activeDot={{ r: 6, fill: "#1d4ed8" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
            <span>เกณฑ์: 0-1 คะแนน = ต่ำ, 2-3 คะแนน = ปานกลาง, ≥4 คะแนน = สูง</span>
            <span className="text-blue-600 font-medium">คะแนนสูงสุดในชุดข้อมูล: 7 คะแนน</span>
          </div>
        </div>

        {/* Risk Level Donut Chart (1 Col) */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800">
                สัดส่วนระดับความเสี่ยง
              </h3>
              <span className="text-xs text-slate-500">Field: ระดับความเสี่ยง</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              จำแนกผู้รับการตรวจตามระดับความเสี่ยง 3 กลุ่ม
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {riskPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.value} คน ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Score Distribution Histogram & Monthly Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Score Breakdown Bar */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                การกระจายความถี่คะแนนความเสี่ยง (0 - 7 คะแนน)
              </h3>
              <p className="text-xs text-slate-500">
                จำนวนผู้ที่มีคะแนนความเสี่ยงในแต่ละระดับ
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-60 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="score" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="จำนวนคน"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Risk Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                สัดส่วนระดับความเสี่ยงตามรอบเดือนที่คัดกรอง
              </h3>
              <p className="text-xs text-slate-500">
                เปรียบเทียบแนวโน้มระหว่างเดือน (มกราคม 2026 vs กุมภาพันธ์ 2026)
              </p>
            </div>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-60 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#475569" }} />
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
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="สูง" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
