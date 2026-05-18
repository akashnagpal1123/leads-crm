const Lead = require("../models/Lead");
const XLSX = require("xlsx");
const {
  getQuarterLeadAnalytics: buildQuarterLeadAnalytics
} = require("../utils/leadQuarterAnalytics");

// exports.getLeads = async (req, res) => {
//   try {
//     const {
//       state,
//       city,
//       product,
//       minQty,
//       maxQty,
//       startDate,
//       endDate,
//       search
//     } = req.query;

//     let query = {};

//     if (state) query["location.state"] = state;
//     if (city) query["location.city"] = city;
//     if (product) query["product.subject"] = product;

//     // 🔥 Quantity filter (your key requirement)
//     if (minQty || maxQty) {
//       query["budget.quantity"] = {};
//       if (minQty) query["budget.quantity"].$gte = Number(minQty);
//       if (maxQty) query["budget.quantity"].$lte = Number(maxQty);
//     }

//     // Date filter
//     if (startDate && endDate) {
//       query["timestamps.createdAt"] = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // Search
//     if (search) {
//       query.$or = [
//         { contactName: { $regex: search, $options: "i" } },
//         { phone: { $regex: search } },
//         { "product.subject": { $regex: search, $options: "i" } }
//       ];
//     }

//     const leads = await Lead.find(query)
//       .sort({ "timestamps.createdAt": -1 })
//       .limit(50);

//     res.json(leads);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };



const buildLeadQuery = ({
  state,
  city,
  product,
  organizationName,
  leadType,
  gst,
  minQty,
  maxQty,
  year,
  startDate,
  endDate,
  phone,
  search
}) => {
  const query = {};

  if (state) query["location.state"] = state;
  if (city) query["location.city"] = city;
  if (product) query["product.subject"] = product;
  if (organizationName) {
    query.organisationName = { $regex: organizationName, $options: "i" };
  }
  if (leadType) {
    query.leadSource = leadType;
  }
  if (gst === "yes") query.gst = true;
  if (gst === "no") query.gst = false;

  if (minQty || maxQty) {
    query["budget.quantity"] = {};
    if (minQty) query["budget.quantity"].$gte = Number(minQty);
    if (maxQty) query["budget.quantity"].$lte = Number(maxQty);
  }

  if (year) {
    const parsedYear = Number(year);
    query.createdAt = {
      $gte: new Date(parsedYear, 0, 1),
      $lte: new Date(parsedYear, 11, 31, 23, 59, 59, 999)
    };
  } else if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (phone) {
    query.phone = { $regex: phone, $options: "i" };
  }

  if (search) {
    query.$or = [
      { contactName: { $regex: search, $options: "i" } },
      { phone: { $regex: search } },
      { "product.subject": { $regex: search, $options: "i" } }
    ];
  }

  return query;
};

exports.getLeadFilterOptions = async (req, res) => {
  try {
    const [leadTypes, yearGroups] = await Promise.all([
      Lead.distinct("leadSource"),
      Lead.aggregate([
        { $match: { createdAt: { $ne: null } } },
        { $group: { _id: { $year: "$createdAt" } } },
        { $sort: { _id: -1 } }
      ])
    ]);

    res.json({
      leadTypes: leadTypes
        .map((type) => (type || "").trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
      years: yearGroups.map((item) => item._id).filter(Boolean)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const {
      state,
      city,
      product,
      organizationName,
      leadType,
      gst,
      minQty,
      maxQty,
      year,
      startDate,
      endDate,
      phone,
      search,
      page = 1,
      limit = 50
    } = req.query;

    const query = buildLeadQuery({
      state,
      city,
      product,
      organizationName,
      leadType,
      gst,
      minQty,
      maxQty,
      year,
      startDate,
      endDate,
      phone,
      search
    });

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Lead.countDocuments(query)
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: leads
    });

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getLeadAnalytics = async (req, res) => {
  try {
    const normalizeFieldExpr = (fieldPath, fallback) => ({
      $cond: [
        {
          $or: [
            { $eq: [fieldPath, null] },
            { $eq: [{ $trim: { input: { $ifNull: [fieldPath, ""] } } }, ""] }
          ]
        },
        fallback,
        { $trim: { input: fieldPath } }
      ]
    });

    const [leadTypeCounts, topProducts, stateDivision, cityDivision, gstDivision, repeatEnquirers, totalLeads] = await Promise.all([
      Lead.aggregate([
        {
          $group: {
            _id: normalizeFieldExpr("$leadSource", "Unknown"),
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Lead.aggregate([
        {
          $group: {
            _id: normalizeFieldExpr("$product.subject", "Unknown Product"),
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),
      Lead.aggregate([
        {
          $group: {
            _id: normalizeFieldExpr("$location.state", "Unknown State"),
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Lead.aggregate([
        {
          $group: {
            _id: normalizeFieldExpr("$location.city", "Unknown City"),
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Lead.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$gst", true] },
                "GST Available",
                "GST Not Available"
              ]
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Lead.aggregate([
        {
          $project: {
            key: {
              $cond: [
                {
                  $ne: [{ $trim: { input: { $ifNull: ["$phone", ""] } } }, ""]
                },
                { $concat: ["PHONE::", { $trim: { input: "$phone" } }] },
                {
                  $concat: [
                    "ORG::",
                    normalizeFieldExpr("$organisationName", "Unknown Organization")
                  ]
                }
              ]
            },
            contactName: normalizeFieldExpr("$contactName", "Unknown Contact"),
            organisationName: normalizeFieldExpr(
              "$organisationName",
              "Unknown Organization"
            )
          }
        },
        {
          $group: {
            _id: "$key",
            enquiries: { $sum: 1 },
            contactName: { $first: "$contactName" },
            organisationName: { $first: "$organisationName" }
          }
        },
        { $match: { enquiries: { $gt: 1 } } },
        { $sort: { enquiries: -1 } },
        { $limit: 10 }
      ]),
      Lead.countDocuments({})
    ]);

    const buildPercentage = (count) =>
      totalLeads > 0 ? Number(((count / totalLeads) * 100).toFixed(2)) : 0;

    res.json({
      generatedAt: new Date(),
      totalLeads,
      leadTypeDivision: leadTypeCounts.map((item) => ({
        type: item._id,
        count: item.count,
        percentage: buildPercentage(item.count)
      })),
      topProducts: topProducts.map((item, index) => ({
        rank: index + 1,
        product: item._id,
        count: item.count,
        percentage: buildPercentage(item.count)
      })),
      stateDivision: stateDivision.map((item) => ({
        state: item._id,
        count: item.count,
        percentage: buildPercentage(item.count)
      })),
      topCities: cityDivision.map((item, index) => ({
        rank: index + 1,
        city: item._id,
        count: item.count,
        percentage: buildPercentage(item.count)
      })),
      gstDivision: gstDivision.map((item) => ({
        type: item._id,
        count: item.count,
        percentage: buildPercentage(item.count)
      })),
      repeatEnquirers: repeatEnquirers.map((item, index) => ({
        rank: index + 1,
        contactName: item.contactName,
        organisationName: item.organisationName,
        enquiries: item.enquiries
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lead analytics" });
  }
};

exports.getQuarterLeadAnalytics = async (req, res) => {
  try {
    const parsedYear = Number.parseInt(req.query.year, 10);
    const year = Number.isNaN(parsedYear) ? undefined : parsedYear;
    const analytics = getLeadAnalyticsFromExcel(year);

    res.json({
      generatedAt: new Date(),
      ...analytics
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch quarter-wise lead analytics" });
  }
};

exports.exportLeads = async (req, res) => {
  try {
    const query = buildLeadQuery(req.query);
    const leads = await Lead.find(query);

    const data = leads.map(l => ({
      Name: l.contactName,
      Organization: l.organisationName,
      LeadType: l.leadSource,
      GST: l.gst ? "Yes" : "No",
      CreatedAt: l.createdAt,
      Phone: l.phone,
      State: l.location.state,
      City: l.location.city,
      Product: l.product.subject,
      Quantity: l.budget.quantity
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=leads.xlsx");
    res.send(buffer);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Export failed" });
  }
};