import React from "react";
import { Filter, X, Search, MapPin, AlertTriangle, Users } from "lucide-react";
import { FilterState, HealthRecord } from "../types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  records: HealthRecord[];
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  records,
  filteredCount,
  totalCount,
}) => {
  // Extract unique areas and person IDs
  const areas = Array.from(new Set(records.map((r) => r.area).filter(Boolean))).sort();
  const personIds = Array.from(new Set(records.map((r) => r.id).filter(Boolean))).sort();
  const riskLevels = ["ต่ำ", "ปานกลาง", "สูง"];

  const hasActiveFilters =
    Boolean(filters.personId) ||
    filters.area !== "all" ||
    filters.riskLevel !== "all" ||
    Boolean(filters.searchQuery);

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-xs p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Filter title & count badge */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">ระบบคัดกรองข้อมูล (Filters)</h2>
            <p className="text-xs text-slate-500">
              กำลังแสดง <span className="font-semibold text-blue-700">{filteredCount}</span> จากทั้งหมด{" "}
              <span>{totalCount}</span> รายการ
            </p>
          </div>
        </div>

        {/* Right: Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1 lg:max-w-4xl">
          {/* 1. Filter: รหัสบุคคล */}
          <div>
            <label htmlFor="filter-person-id" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>รหัสบุคคล</span>
            </label>
            <div className="relative">
              <select
                id="filter-person-id"
                value={filters.personId}
                onChange={(e) => onFilterChange("personId", e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">ทั้งหมด (ทุกรหัสบุคคล)</option>
                {personIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Filter: พื้นที่ */}
          <div>
            <label htmlFor="filter-area" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>พื้นที่</span>
            </label>
            <select
              id="filter-area"
              value={filters.area}
              onChange={(e) => onFilterChange("area", e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">ทุกพื้นที่</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter: ระดับความเสี่ยง */}
          <div>
            <label htmlFor="filter-risk-level" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-500" />
              <span>ระดับความเสี่ยง</span>
            </label>
            <select
              id="filter-risk-level"
              value={filters.riskLevel}
              onChange={(e) => onFilterChange("riskLevel", e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">ทุกระดับความเสี่ยง</option>
              {riskLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === "สูง" ? "🔴 ความเสี่ยงสูง" : lvl === "ปานกลาง" ? "🟡 ความเสี่ยงปานกลาง" : "🟢 ความเสี่ยงต่ำ"}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Search Keyword */}
          <div>
            <label htmlFor="filter-search" className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span>ค้นหาเพิ่มเติม</span>
            </label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                placeholder="ค้นหา เพศ, อายุ, โรค..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange("searchQuery", e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange("searchQuery", "")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-end lg:self-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>ล้างฟิลเตอร์</span>
          </button>
        )}
      </div>
    </div>
  );
};
