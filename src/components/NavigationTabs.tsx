import React from "react";
import {
  LayoutDashboard,
  HeartPulse,
  TrendingUp,
  Smile,
  ShieldAlert,
  TableProperties,
} from "lucide-react";

export type TabType =
  | "overview"
  | "health-risk"
  | "health-trend"
  | "health-behavior"
  | "age-risk"
  | "detail-table";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "ภาพรวม & KPI", icon: LayoutDashboard },
    { id: "health-risk", label: "Health Risk", icon: HeartPulse },
    { id: "health-trend", label: "Health Trend", icon: TrendingUp },
    { id: "health-behavior", label: "Health Behavior", icon: Smile },
    { id: "age-risk", label: "กลุ่มอายุ & พฤติกรรมเสี่ยง", icon: ShieldAlert },
    { id: "detail-table", label: "รายละเอียดเชิงลึก", icon: TableProperties },
  ];

  return (
    <nav className="bg-white border-b border-blue-100 shadow-2xs mb-6 -mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-2.5 gap-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
