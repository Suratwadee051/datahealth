import React from "react";
import { Activity, Heart, Droplets, AlertOctagon, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { KpiSummary } from "../types";

interface KpiCardsProps {
  kpi: KpiSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpi }) => {
  const normalBmiPct = kpi.totalCount > 0
    ? Math.round((kpi.bmiCategoryBreakdown.normal / kpi.totalCount) * 100)
    : 0;

  const normalSugarPct = kpi.totalCount > 0
    ? Math.round(((kpi.totalCount - kpi.highSugarCount) / kpi.totalCount) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. BMI Card */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ดัชนีมวลกายเฉลี่ย (BMI)
          </span>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {kpi.avgBmi || "--"}
          </span>
          <span className="text-xs text-slate-500 font-medium">kg/m²</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">เกณฑ์มาตรฐานเอเชีย:</span>
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              18.5 - 22.9 ปกติ
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>สมส่วน {kpi.bmiCategoryBreakdown.normal} คน ({normalBmiPct}%)</span>
            <span className="text-amber-600 font-medium">อ้วน/เกิน {kpi.bmiCategoryBreakdown.overweight + kpi.bmiCategoryBreakdown.obese} คน</span>
          </div>
        </div>
      </div>

      {/* 2. Pulse Card */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            อัตราการเต้นชีพจรเฉลี่ย
          </span>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {kpi.avgPulse || "--"}
          </span>
          <span className="text-xs text-slate-500 font-medium">bpm (ครั้ง/นาที)</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">เกณฑ์มาตรฐานขณะพัก:</span>
            <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              60 - 100 bpm
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ต่ำสุด: {kpi.minPulse} bpm</span>
            <span>สูงสุด: {kpi.maxPulse} bpm</span>
          </div>
        </div>
      </div>

      {/* 3. Blood Sugar Card */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ปริมาณน้ำตาลในเลือดเฉลี่ย
          </span>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {kpi.avgBloodSugar || "--"}
          </span>
          <span className="text-xs text-slate-500 font-medium">mg/dL</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">เกณฑ์คัดกรองเบาหวาน:</span>
            <span className={`font-medium px-2 py-0.5 rounded border ${
              kpi.avgBloodSugar < 100
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : kpi.avgBloodSugar <= 125
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}>
              ปกติ &lt; 100 mg/dL
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ปกติ {normalSugarPct}%</span>
            <span className="text-rose-600 font-medium">เสี่ยง/เบาหวาน {kpi.highSugarCount} คน</span>
          </div>
        </div>
      </div>

      {/* 4. Risk Score Card */}
      <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            คะแนนความเสี่ยงเฉลี่ย
          </span>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {kpi.avgRiskScore || "--"}
          </span>
          <span className="text-xs text-slate-500 font-medium">คะแนน</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">กลุ่มเสี่ยงสูง:</span>
            <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              {kpi.highRiskCount} คน ({kpi.highRiskPercentage}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ต่ำ: {kpi.lowRiskCount} คน</span>
            <span>ปานกลาง: {kpi.moderateRiskCount} คน</span>
          </div>
        </div>
      </div>
    </div>
  );
};
