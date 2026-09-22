import React, { useState, useMemo } from "react";
import {
  TableProperties,
  ArrowUpDown,
  Download,
  Eye,
  X,
  Heart,
  Activity,
  Droplets,
  Gauge,
  CheckCircle,
  AlertTriangle,
  Flame,
  User,
} from "lucide-react";
import { HealthRecord } from "../types";
import {
  getBmiStatus,
  getBloodPressureStatus,
  getBloodSugarStatus,
  getRiskLevelBadge,
} from "../utils/healthCalculations";

interface DetailDataTableProps {
  records: HealthRecord[];
}

type SortField =
  | "id"
  | "age"
  | "bmi"
  | "sbp"
  | "dbp"
  | "bloodSugar"
  | "pulseBpm"
  | "riskScore"
  | "screeningDate";

export const DetailDataTable: React.FC<DetailDataTableProps> = ({ records }) => {
  const [sortField, setSortField] = useState<SortField>("riskScore");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "screeningDate") {
        const partsA = a.screeningDate.split("/");
        const partsB = b.screeningDate.split("/");
        valA = partsA.length === 3 ? new Date(Number(partsA[2]), Number(partsA[1]) - 1, Number(partsA[0])).getTime() : 0;
        valB = partsB.length === 3 ? new Date(Number(partsB[2]), Number(partsB[1]) - 1, Number(partsB[0])).getTime() : 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [records, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const pagedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      "รหัสบุคคล",
      "วันที่คัดกรอง",
      "พื้นที่",
      "เพศ",
      "อายุ",
      "ส่วนสูง_cm",
      "น้ำหนัก_kg",
      "BMI",
      "SBP_mmHg",
      "DBP_mmHg",
      "ชีพจร_bpm",
      "น้ำตาล_mg_dL",
      "สูบบุหรี่",
      "ดื่มแอลกอฮอล์",
      "การออกกำลังกาย",
      "เบาหวาน_คัดกรอง",
      "ความดันโลหิตสูง_คัดกรอง",
      "คะแนนความเสี่ยง",
      "ระดับความเสี่ยง",
    ];

    const rows = sortedRecords.map((r) => [
      r.id,
      r.screeningDate,
      r.area,
      r.gender,
      r.age,
      r.heightCm,
      r.weightKg,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulseBpm,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesScreening,
      r.hypertensionScreening,
      r.riskScore,
      r.riskLevel,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `การตรวจคัดกรองสุขภาพ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="detail-table-section" className="mb-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              รายละเอียดเชิงลึกและข้อมูลสุขภาพรายบุคคล (Detail View)
            </h2>
            <p className="text-xs text-slate-500">
              จำแนกสีตามระดับความสำคัญ: เขียว (ปกติ) • เหลือง (เฝ้าระวัง) • ส้ม (เสี่ยง) • แดง (เสี่ยงสูง/วิกฤต)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="ส่งออกข้อมูลเป็น CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("age")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ข้อมูลพื้นฐาน</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("bmi")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>BMI</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("sbp")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ความดัน SBP/DBP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("bloodSugar")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">พฤติกรรมสุขภาพ</th>
                <th className="px-4 py-3">ผลคัดกรองโรค</th>
                <th
                  onClick={() => handleSort("riskScore")}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ระดับความเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                pagedRecords.map((r) => {
                  const bmiInfo = getBmiStatus(r.bmi);
                  const bpInfo = getBloodPressureStatus(r.sbp, r.dbp);
                  const sugarInfo = getBloodSugarStatus(r.bloodSugar);
                  const riskBadge = getRiskLevelBadge(r.riskLevel);

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      {/* ID & Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-blue-700 font-mono text-xs">{r.id}</span>
                        <div className="text-[10px] text-slate-400">{r.screeningDate}</div>
                      </td>

                      {/* Profile info */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {r.gender} • อายุ {r.age} ปี
                        </div>
                        <div className="text-[10px] text-slate-500">พื้นที่: {r.area}</div>
                      </td>

                      {/* BMI with Color Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{r.bmi}</div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${bmiInfo.color}`}
                        >
                          {bmiInfo.label}
                        </span>
                      </td>

                      {/* Blood Pressure with Color Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {r.sbp}/{r.dbp}{" "}
                          <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${bpInfo.color}`}
                        >
                          {bpInfo.label}
                        </span>
                      </td>

                      {/* Sugar with Color Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{r.bloodSugar}</div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${sugarInfo.color}`}
                        >
                          {sugarInfo.label}
                        </span>
                      </td>

                      {/* Health Behaviors */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span
                            className={
                              r.smoking === "สูบ" ? "text-rose-600 font-medium" : "text-slate-500"
                            }
                          >
                            บุหรี่: {r.smoking}
                          </span>
                          <span
                            className={
                              r.alcohol === "ดื่ม" ? "text-amber-600 font-medium" : "text-slate-500"
                            }
                          >
                            สุรา: {r.alcohol}
                          </span>
                          <span
                            className={
                              r.exercise === "ไม่ออกกำลังกาย"
                                ? "text-red-500 font-medium"
                                : r.exercise === "สม่ำเสมอ"
                                ? "text-emerald-600"
                                : "text-slate-500"
                            }
                          >
                            ออกกำลัง: {r.exercise}
                          </span>
                        </div>
                      </td>

                      {/* Disease Screening */}
                      <td className="px-4 py-3 whitespace-nowrap text-[11px]">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={
                              r.diabetesScreening === "มีแนวโน้ม/เสี่ยง"
                                ? "text-purple-700 font-medium"
                                : "text-slate-400"
                            }
                          >
                            เบาหวาน: {r.diabetesScreening}
                          </span>
                          <span
                            className={
                              r.hypertensionScreening === "มีแนวโน้ม/เสี่ยง"
                                ? "text-red-600 font-medium"
                                : "text-slate-400"
                            }
                          >
                            ความดัน: {r.hypertensionScreening}
                          </span>
                        </div>
                      </td>

                      {/* Risk Score & Level */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskBadge.bg}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${riskBadge.indicator}`} />
                            {riskBadge.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          คะแนน: {r.riskScore}/7
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                          title="ดูการวินิจฉัยสุขภาพรายบุคคล"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            แสดง {sortedRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, sortedRecords.length)} จากทั้งหมด{" "}
            <span className="font-semibold text-slate-900">{sortedRecords.length}</span> รายการ
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <span className="px-2 font-medium">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-blue-100 animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {selectedRecord.id}
                </div>
                <div>
                  <h3 className="font-bold text-base">บัตรสรุปผลการคัดกรองสุขภาพรายบุคคล</h3>
                  <p className="text-xs text-blue-100">
                    วันที่ตรวจ: {selectedRecord.screeningDate} • พื้นที่: {selectedRecord.area}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Demographics Strip */}
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">เพศ</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">อายุ</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.age} ปี</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ส่วนสูง</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">น้ำหนัก</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.weightKg} kg</span>
                </div>
              </div>

              {/* Vitals Summary Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* BMI */}
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-sky-500" /> BMI
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{selectedRecord.bmi}</span>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                      getBmiStatus(selectedRecord.bmi).color
                    }`}
                  >
                    {getBmiStatus(selectedRecord.bmi).label}
                  </span>
                </div>

                {/* Blood Pressure */}
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-500" /> ความดันโลหิต
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedRecord.sbp}/{selectedRecord.dbp}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                      getBloodPressureStatus(selectedRecord.sbp, selectedRecord.dbp).color
                    }`}
                  >
                    {getBloodPressureStatus(selectedRecord.sbp, selectedRecord.dbp).label}
                  </span>
                </div>

                {/* Blood Sugar */}
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-amber-500" /> น้ำตาลในเลือด
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedRecord.bloodSugar} mg/dL
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                      getBloodSugarStatus(selectedRecord.bloodSugar).color
                    }`}
                  >
                    {getBloodSugarStatus(selectedRecord.bloodSugar).label}
                  </span>
                </div>

                {/* Pulse */}
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> ชีพจร
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedRecord.pulseBpm} bpm
                    </span>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    อัตราปกติขณะพัก
                  </span>
                </div>
              </div>

              {/* Behavior & Disease Screenings */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
                <h4 className="font-bold text-slate-800">พฤติกรรมและการคัดกรองโรค</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    สูบบุหรี่: <span className="font-semibold text-slate-800">{selectedRecord.smoking}</span>
                  </div>
                  <div>
                    ดื่มแอลกอฮอล์: <span className="font-semibold text-slate-800">{selectedRecord.alcohol}</span>
                  </div>
                  <div>
                    ออกกำลังกาย: <span className="font-semibold text-slate-800">{selectedRecord.exercise}</span>
                  </div>
                  <div>
                    คัดกรองเบาหวาน:{" "}
                    <span
                      className={`font-semibold ${
                        selectedRecord.diabetesScreening === "มีแนวโน้ม/เสี่ยง"
                          ? "text-purple-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {selectedRecord.diabetesScreening}
                    </span>
                  </div>
                  <div>
                    คัดกรองความดันสูง:{" "}
                    <span
                      className={`font-semibold ${
                        selectedRecord.hypertensionScreening === "มีแนวโน้ม/เสี่ยง"
                          ? "text-red-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {selectedRecord.hypertensionScreening}
                    </span>
                  </div>
                  <div>
                    คะแนนความเสี่ยง:{" "}
                    <span className="font-bold text-blue-700">
                      {selectedRecord.riskScore} คะแนน ({selectedRecord.riskLevel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Advice */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-slate-700">
                <span className="font-bold text-blue-900 block mb-1">คำแนะนำสุขภาพเบื้องต้น:</span>
                {selectedRecord.riskLevel === "สูง" ? (
                  <p className="text-red-700 leading-relaxed">
                    ควรส่งต่อพบแพทย์เพื่อตรวจวินิจฉัยยืนยันภาวะความดันโลหิตสูงและเบาหวาน ปรับเปลี่ยนพฤติกรรมโดยงดสูบบุหรี่และเครื่องดื่มแอลกอฮอล์ ควบคุมอาหารเค็มและหวาน
                  </p>
                ) : selectedRecord.riskLevel === "ปานกลาง" ? (
                  <p className="text-amber-800 leading-relaxed">
                    ควรเฝ้าระวัง ควบคุมน้ำหนักตัว และเพิ่มการออกกำลังกายระดับปานกลางสัปดาห์ละอย่างน้อย 150 นาที ตรวจซ้ำทุก 3-6 เดือน
                  </p>
                ) : (
                  <p className="text-emerald-800 leading-relaxed">
                    สุขภาพโดยรวมอยู่ในเกณฑ์ดี ให้รักษาวิถีชีวิตที่ส่งเสริมสุขภาพ ออกกำลังกายสม่ำเสมอ และตรวจคัดกรองประจำปี
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
