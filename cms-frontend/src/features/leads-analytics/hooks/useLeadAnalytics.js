import { useCallback, useEffect, useState } from "react";
import { fetchLeadAnalytics, fetchQuarterLeadAnalytics } from "../../../services/api";

const initialAnalytics = {
  totalLeads: 0,
  leadTypeDivision: [],
  topProducts: [],
  stateDivision: [],
  topCities: [],
  gstDivision: [],
  repeatEnquirers: []
};

const useLeadAnalytics = (shouldLoad) => {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [yearlyAnalytics, setYearlyAnalytics] = useState({
    availableYears: [],
    selectedYear: null,
    quarterWise: {
      Q1: { topCities: [], topProducts: [], totalLeads: 0 },
      Q2: { topCities: [], topProducts: [], totalLeads: 0 },
      Q3: { topCities: [], topProducts: [], totalLeads: 0 },
      Q4: { topCities: [], topProducts: [], totalLeads: 0 }
    }
  });
  const [quarterAnalyticsLoading, setQuarterAnalyticsLoading] = useState(false);

  const loadLeadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetchLeadAnalytics();
      setAnalytics({
        totalLeads: res.data.totalLeads ?? 0,
        leadTypeDivision: res.data.leadTypeDivision ?? [],
        topProducts: res.data.topProducts ?? [],
        stateDivision: res.data.stateDivision ?? [],
        topCities: res.data.topCities ?? [],
        gstDivision: res.data.gstDivision ?? [],
        repeatEnquirers: res.data.repeatEnquirers ?? []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const loadQuarterAnalytics = useCallback(async (year) => {
    setQuarterAnalyticsLoading(true);
    try {
      const res = await fetchQuarterLeadAnalytics(year);
      setYearlyAnalytics({
        availableYears: res.data.availableYears ?? [],
        selectedYear: res.data.selectedYear ?? null,
        quarterWise: res.data.quarterWise ?? {
          Q1: { topCities: [], topProducts: [], totalLeads: 0 },
          Q2: { topCities: [], topProducts: [], totalLeads: 0 },
          Q3: { topCities: [], topProducts: [], totalLeads: 0 },
          Q4: { topCities: [], topProducts: [], totalLeads: 0 }
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setQuarterAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldLoad) {
      loadLeadAnalytics();
      loadQuarterAnalytics();
    }
  }, [loadLeadAnalytics, loadQuarterAnalytics, shouldLoad]);

  return {
    analytics,
    analyticsLoading,
    reloadAnalytics: loadLeadAnalytics,
    yearlyAnalytics,
    quarterAnalyticsLoading,
    reloadQuarterAnalytics: loadQuarterAnalytics
  };
};

export default useLeadAnalytics;
