/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { NavigationTabs, TabType } from "./components/NavigationTabs";
import { KpiCards } from "./components/KpiCards";
import { HealthRiskSection } from "./components/HealthRiskSection";
import { HealthTrendSection } from "./components/HealthTrendSection";
import { HealthBehaviorSection } from "./components/HealthBehaviorSection";
import { AgeRiskBehaviorSection } from "./components/AgeRiskBehaviorSection";
import { DetailDataTable } from "./components/DetailDataTable";
import { HealthRecord, FilterState } from "./types";
import { FALLBACK_RECORDS } from "./data/fallbackData";
import { calculateKpi } from "./utils/healthCalculations";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(FALLBACK_RECORDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const [filters, setFilters] = useState<FilterState>({
    personId: "",
    area: "all",
    riskLevel: "all",
    searchQuery: "",
  });

  // Fetch live data from Google Sheet via API
  const fetchLiveData = useCallback(async (isManualRefresh = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/health-data?t=${Date.now()}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.records) && data.records.length > 0) {
        setRecords(data.records);
        setLastUpdated(new Date(data.updatedAt || Date.now()));
        if (isManualRefresh) {
          showToast(`อัปเดตข้อมูลสำเร็จ! ดึงข้อมูลล่าสุด ${data.records.length} รายการจาก Google Sheet`);
        }
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.warn("Could not fetch from /api/health-data, using local records:", err);
      if (isManualRefresh) {
        showToast("เชื่อมต่อชีตสดชั่วคราวไม่ได้ กำลังแสดงชุดข้อมูลที่แคชไว้ล่าสุด");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData(false);
  }, [fetchLiveData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      personId: "",
      area: "all",
      riskLevel: "all",
      searchQuery: "",
    });
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Person ID
      if (filters.personId && r.id !== filters.personId) {
        return false;
      }
      // 2. Area
      if (filters.area !== "all" && r.area !== filters.area) {
        return false;
      }
      // 3. Risk Level
      if (filters.riskLevel !== "all" && r.riskLevel !== filters.riskLevel) {
        return false;
      }
      // 4. Search Query (matches id, area, gender, screening outcomes)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(query);
        const matchArea = r.area.toLowerCase().includes(query);
        const matchGender = r.gender.toLowerCase().includes(query);
        const matchAge = r.age.toString().includes(query);
        const matchSmoking = r.smoking.toLowerCase().includes(query);
        const matchDiabetes = r.diabetesScreening.toLowerCase().includes(query);
        const matchHypertension = r.hypertensionScreening.toLowerCase().includes(query);
        if (
          !matchId &&
          !matchArea &&
          !matchGender &&
          !matchAge &&
          !matchSmoking &&
          !matchDiabetes &&
          !matchHypertension
        ) {
          return false;
        }
      }
      return true;
    });
  }, [records, filters]);

  // Compute KPI metrics based on filtered records
  const kpi = useMemo(() => {
    return calculateKpi(filteredRecords);
  }, [filteredRecords]);

  // Navigation tab switcher and smooth scroll
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== "overview") {
      const sectionMap: Record<string, string> = {
        "health-risk": "health-risk-section",
        "health-trend": "health-trend-section",
        "health-behavior": "health-behavior-section",
        "age-risk": "age-risk-section",
        "detail-table": "detail-table-section",
      };
      const elementId = sectionMap[tab];
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header & Controls */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isLoading}
        onRefresh={() => fetchLiveData(true)}
        recordCount={records.length}
        dataSource="Google Sheet ID: 1NP9UlFb_pFjFcBvzned4Wzz397Wh48CkX--insZAa7Q"
      />

      {/* 5. Navigation Controls (Sticky Subnav) */}
      <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-1 w-full">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          records={records}
          filteredCount={filteredRecords.length}
          totalCount={records.length}
        />

        {/* 2. KPI Cards / Summary Cards */}
        <KpiCards kpi={kpi} />

        {/* Tab-driven or full layout view */}
        {activeTab === "overview" ? (
          <>
            {/* 3.1 Health Risk */}
            <HealthRiskSection records={filteredRecords} />

            {/* 3.2 Health Trend */}
            <HealthTrendSection records={filteredRecords} />

            {/* 3.3 Health Behavior */}
            <HealthBehaviorSection records={filteredRecords} />

            {/* Extra: Age Group & Behavior Risk Matrix */}
            <AgeRiskBehaviorSection records={filteredRecords} />

            {/* 4. Detail Data Table */}
            <DetailDataTable records={filteredRecords} />
          </>
        ) : activeTab === "health-risk" ? (
          <>
            <HealthRiskSection records={filteredRecords} />
            <DetailDataTable records={filteredRecords} />
          </>
        ) : activeTab === "health-trend" ? (
          <>
            <HealthTrendSection records={filteredRecords} />
            <DetailDataTable records={filteredRecords} />
          </>
        ) : activeTab === "health-behavior" ? (
          <>
            <HealthBehaviorSection records={filteredRecords} />
            <DetailDataTable records={filteredRecords} />
          </>
        ) : activeTab === "age-risk" ? (
          <>
            <AgeRiskBehaviorSection records={filteredRecords} />
            <DetailDataTable records={filteredRecords} />
          </>
        ) : (
          <DetailDataTable records={filteredRecords} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-100 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-700">
            ระบบแดชบอร์ดการตรวจคัดกรองสุขภาพเพื่อสำรวจกลุ่มเสี่ยงโรคต่าง ๆ
          </p>
          <p className="text-slate-500">
            ผู้จัดทำ: <span className="font-semibold text-blue-700">น.ส.สุรัตนวดี รอดกสิกรรม</span>{" "}
            • แหล่งข้อมูล: Google Spreadsheet ID{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-600">
              1NP9UlFb_pFjFcBvzned4Wzz397Wh48CkX--insZAa7Q
            </code>
          </p>
          <p className="text-[11px] text-slate-400">
            © 2026 ระบบสารสนเทศสุขภาพชุมชน • รองรับการอัปเดตข้อมูลสดแบบ Real-Time
          </p>
        </div>
      </footer>
    </div>
  );
}
