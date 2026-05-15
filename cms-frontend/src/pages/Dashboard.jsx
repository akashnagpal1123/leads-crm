import { useState } from "react";
import TopNav from "../features/layout/TopNav";
import SidebarMenu from "../features/layout/SidebarMenu";
import WelcomeSection from "../features/welcome/WelcomeSection";
import LeadManagementSection from "../features/leads-management/LeadManagementSection";
import LeadsAnalyticsSection from "../features/leads-analytics/LeadsAnalyticsSection";
import useLeadsData from "../features/leads-management/hooks/useLeadsData";
import useLeadAnalytics from "../features/leads-analytics/hooks/useLeadAnalytics";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("welcome");
  const { leads, page, totalPages, setPage, applyFilters } = useLeadsData();
  const {
    analytics,
    analyticsLoading,
    yearlyAnalytics,
    quarterAnalyticsLoading,
    reloadQuarterAnalytics
  } = useLeadAnalytics(
    activeMenu === "leads-analytics"
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <TopNav />

      <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SidebarMenu activeMenu={activeMenu} onMenuChange={setActiveMenu} />

        <section className="min-w-0">
          {activeMenu === "welcome" && (
            <WelcomeSection onOpenLeadManagement={() => setActiveMenu("lead-management")} />
          )}

          {activeMenu === "lead-management" && (
            <LeadManagementSection
              leads={leads}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onApplyFilters={applyFilters}
            />
          )}

          {activeMenu === "leads-analytics" && (
            <LeadsAnalyticsSection
              analytics={analytics}
              analyticsLoading={analyticsLoading}
              yearlyAnalytics={yearlyAnalytics}
              quarterAnalyticsLoading={quarterAnalyticsLoading}
              onYearChange={reloadQuarterAnalytics}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;