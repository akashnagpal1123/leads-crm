import { useCallback, useEffect, useState } from "react";
import { fetchLeads } from "../../../services/api";

const useLeadsData = () => {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLeads = useCallback(async () => {
    try {
      const res = await fetchLeads({ ...filters, page });
      setLeads(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  }, [filters, page]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const applyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  return {
    leads,
    page,
    totalPages,
    setPage,
    applyFilters
  };
};

export default useLeadsData;
