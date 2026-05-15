import Filters from "../../components/Filters";
import LeadsTable from "../../components/LeadsTable";
import Pagination from "../../components/Pagination";

const LeadManagementSection = ({
  leads,
  page,
  totalPages,
  onPageChange,
  onApplyFilters
}) => {
  return (
    <>
      {/* <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#29ab87] to-[#1f8a6d] p-6 text-white shadow-lg">
        <h2 className="text-xl font-semibold md:text-2xl">Lead Management</h2>
        <p className="mt-2 text-sm text-emerald-50">
          Track and manage your leads with quick filtering and direct WhatsApp
          outreach.
        </p>
      </div> */}

      <Filters onApply={onApplyFilters} />
      <LeadsTable leads={leads} page={page} limit={50} />
      <Pagination page={page} totalPages={totalPages} setPage={onPageChange} />
    </>
  );
};

export default LeadManagementSection;
