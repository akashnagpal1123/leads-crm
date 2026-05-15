import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api"
  baseURL: import.meta.env.VITE_API_URL
});

export const fetchLeads = (params) => API.get("/leads", { params });
export const fetchLeadFilterOptions = () => API.get("/leads/filter-options");
export const fetchLeadAnalytics = () => API.get("/leads/analytics");
export const fetchQuarterLeadAnalytics = (year) =>
  API.get("/leads/analytics/quarterly", { params: { year } });
export const exportLeads = (params) =>
  API.get("/leads/export", {
    params,
    responseType: "blob"
  });