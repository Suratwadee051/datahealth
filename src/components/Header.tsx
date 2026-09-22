import React from "react";
import { Activity, RefreshCw, User, Calendar, CheckCircle2 } from "lucide-react";
import { formatThaiDateTime } from "../utils/healthCalculations";

interface HeaderProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  recordCount: number;
  dataSource: string;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  recordCount,
  dataSource,
}) => {
  return (
    <header className="bg-white border-b border-blue-100 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title & Description */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  การตรวจคัดกรองสุขภาพ
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                เป็นข้อมูลสำหรับการคัดกรองสุขภาพเพื่อสำรวจกลุ่มเสี่ยงโรคต่าง ๆ
              </p>
            </div>
          </div>

          {/* Action buttons & Creator Info */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            {/* Refresh Button */}
            <button
              id="refresh-data-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow transition-all disabled:opacity-60 cursor-pointer active:scale-95"
              title="ดึงข้อมูลล่าสุดจาก Google Sheet ทันที"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "กำลังโหลดข้อมูล..." : "รีเฟรชข้อมูล"}</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Creator and Timestamps */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-y-2 gap-x-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {/* Creator */}
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>ผู้จัดทำ:</span>
              <span className="text-blue-900 bg-blue-50/80 px-2 py-0.5 rounded font-semibold border border-blue-100">
                น.ส.สุรัตนวดี รอดกสิกรรม
              </span>
            </div>

            {/* Last updated timestamp */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>อัปเดตข้อมูลล่าสุด:</span>
              <span className="font-medium text-slate-800">{formatThaiDateTime(lastUpdated)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              พร้อมใช้งาน ({recordCount} รายการ)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
