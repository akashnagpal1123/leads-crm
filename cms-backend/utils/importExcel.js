const XLSX = require("xlsx");
const mongoose = require("mongoose");
const Lead = require("../models/Lead");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

function parseBudget(budgetStr) {
  if (!budgetStr || budgetStr === "-") {
    return { quantity: null, unit: null };
  }

  const match = budgetStr.toString().match(/(\d+)/);

  return {
    quantity: match ? parseInt(match[1]) : null,
    unit: "piece"
  };
}

function formatDate(date) {
  if (!date) return null;

  // Excel may store dates as serial numbers.
  if (typeof date === "number") {
    const parsed = XLSX.SSF.parse_date_code(date);
    if (!parsed) return null;
    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }

  // Handle dd/mm/yyyy or dd-mm-yyyy explicitly.
  if (typeof date === "string") {
    const value = date.trim();
    const match = value.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

async function importData() {
  const workbook = XLSX.readFile("data.xlsx");

  for (let sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const formatted = data.map(row => {
      const createdAt = formatDate(row["Created At"]);
      const lastUpdate = formatDate(row["Last Update"]);

      return {
        leadSource: row["Lead Source"],
        contactName: row["Contact Name"],
        organisationName: row["Organisation Name"] || null,
        gst: row["GST No"] === "Yes",

        phone: row["Phone"],

        location: {
          country: row["Contact Country"],
          state: row["State"],
          city: row["Customer City"]
        },

        stage: row["Stage"],
        status: row["Status"],

        product: {
          subject: row["Subject"],
          description: row["Description"]
        },

        budget: parseBudget(row["Budget"]),

        timestamps: {
          createdAt,
          lastUpdate
        },

        // Keep mongoose auto timestamp fields aligned with Excel values.
        createdAt,
        updatedAt: lastUpdate || createdAt
      };
    });

    await Lead.insertMany(formatted);
    console.log(`✅ Imported: ${sheetName}`);
  }

  console.log("🎉 All data imported");
  process.exit();
}

importData();