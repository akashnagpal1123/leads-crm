const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const EXCEL_FILE_PATH = path.join(__dirname, "..", "data.xlsx");
const VALID_LEAD_SOURCES = new Set(["enquiry", "buy lead", "call enquiry"]);
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const QUARTER_ANALYTICS_MIN_YEAR = 2017;
const QUARTER_ANALYTICS_MAX_YEAR = 2026;

let cachedRows = [];
let cachedModifiedTimeMs = null;

function normalizeString(value, fallback = "Unknown") {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value).trim();
  return normalized === "" ? fallback : normalized;
}

function parseCreatedAt(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) {
      return null;
    }
    const date = new Date(parsed.y, parsed.m - 1, parsed.d);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getQuarterFromMonth(month) {
  if (month <= 2) return "Q1";
  if (month <= 5) return "Q2";
  if (month <= 8) return "Q3";
  return "Q4";
}

function ensureRowsLoaded() {
  const stats = fs.statSync(EXCEL_FILE_PATH);
  if (cachedModifiedTimeMs === stats.mtimeMs && cachedRows.length > 0) {
    return cachedRows;
  }

  const workbook = XLSX.readFile(EXCEL_FILE_PATH);
  const allRows = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    allRows.push(...rows);
  });

  cachedRows = allRows.map((row) => ({
    leadSource: normalizeString(row["Lead Source"], "").toLowerCase(),
    city: normalizeString(row["Customer City"]),
    state: normalizeString(row["State"]),
    subject: normalizeString(row["Subject"]),
    createdAt: parseCreatedAt(row["Created At"])
  }));
  cachedModifiedTimeMs = stats.mtimeMs;
  return cachedRows;
}

function getAvailableYears() {
  const years = [];
  for (let year = QUARTER_ANALYTICS_MIN_YEAR; year <= QUARTER_ANALYTICS_MAX_YEAR; year += 1) {
    years.push(year);
  }
  return years;
}

function aggregateTopValues(items, keyName, valueName, topLimit = 5) {
  const counts = new Map();

  items.forEach((item) => {
    const current = counts.get(item) || 0;
    counts.set(item, current + 1);
  });

  return Array.from(counts.entries())
    .map(([name, totalLeads]) => ({ [keyName]: name, [valueName]: totalLeads }))
    .sort((a, b) => b[valueName] - a[valueName])
    .slice(0, topLimit);
}

function buildQuarterAnalytics(rows, year) {
  const result = {
    Q1: { topCities: [], topProducts: [], totalLeads: 0 },
    Q2: { topCities: [], topProducts: [], totalLeads: 0 },
    Q3: { topCities: [], topProducts: [], totalLeads: 0 },
    Q4: { topCities: [], topProducts: [], totalLeads: 0 }
  };

  const buckets = {
    Q1: [],
    Q2: [],
    Q3: [],
    Q4: []
  };

  rows.forEach((row) => {
    if (!row.createdAt || row.createdAt.getFullYear() !== year) {
      return;
    }
    if (!VALID_LEAD_SOURCES.has(row.leadSource)) {
      return;
    }

    const quarter = getQuarterFromMonth(row.createdAt.getMonth());
    buckets[quarter].push(row);
  });

  QUARTERS.forEach((quarter) => {
    const quarterRows = buckets[quarter];
    result[quarter] = {
      totalLeads: quarterRows.length,
      topCities: aggregateTopValues(
        quarterRows.map((row) => row.city),
        "city",
        "totalLeads",
        5
      ),
      topProducts: aggregateTopValues(
        quarterRows.map((row) => row.subject),
        "product",
        "totalLeads",
        10
      )
    };
  });

  return result;
}

function getLeadAnalyticsFromExcel(selectedYear) {
  const rows = ensureRowsLoaded();
  const availableYears = getAvailableYears();
  const latestYear = availableYears[availableYears.length - 1] || null;
  const safeYear =
    Number.isInteger(selectedYear) && availableYears.includes(selectedYear)
      ? selectedYear
      : latestYear;

  return {
    availableYears,
    selectedYear: safeYear,
    quarterWise:
      safeYear === null
        ? {
            Q1: { topCities: [], topProducts: [], totalLeads: 0 },
            Q2: { topCities: [], topProducts: [], totalLeads: 0 },
            Q3: { topCities: [], topProducts: [], totalLeads: 0 },
            Q4: { topCities: [], topProducts: [], totalLeads: 0 }
          }
        : buildQuarterAnalytics(rows, safeYear)
  };
}

module.exports = {
  getLeadAnalyticsFromExcel
};
