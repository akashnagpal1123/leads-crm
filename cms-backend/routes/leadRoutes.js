const express = require("express");
const router = express.Router();
const {
  getLeads,
  exportLeads,
  getLeadAnalytics,
  getQuarterLeadAnalytics,
  getLeadFilterOptions
} = require("../controllers/leadController");

router.get("/filter-options", getLeadFilterOptions);
router.get("/", getLeads);
router.get("/analytics", getLeadAnalytics);
router.get("/analytics/quarterly", getQuarterLeadAnalytics);
router.get("/export", exportLeads);

module.exports = router;