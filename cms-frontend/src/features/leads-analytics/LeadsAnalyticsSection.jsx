import BarChartCard from "./components/BarChartCard";
import RepeatEnquiriesCard from "./components/RepeatEnquiriesCard";
import QuarterLeadListings from "./components/QuarterLeadListings";

const LeadsAnalyticsSection = ({
  analytics,
  analyticsLoading,
  yearlyAnalytics,
  quarterAnalyticsLoading,
  onYearChange
}) => {
  return (
    <>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#29ab87] to-[#1f8a6d] p-6 text-white shadow-lg">
        <h2 className="text-xl font-semibold md:text-2xl">Leads Analytics</h2>
        <p className="mt-2 text-sm text-emerald-50">
          Snapshot analytics based on the leads currently stored in the database.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {analyticsLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm md:col-span-2">
            Loading analytics...
          </div>
        ) : (
          <>

          


           

            <BarChartCard
              title="Enquiry Type Division"
              totalLabel={`Total ${analytics.totalLeads}`}
              data={analytics.leadTypeDivision}
              labelKey="type"
              colorClass="bg-[#29ab87]"
              emptyText="No lead division data available."
            />

            <BarChartCard
              title="Most Ordered Products"
              data={analytics.topProducts.map((item) => ({
                ...item,
                productLabel: `${item.rank}. ${item.product}`
              }))}
              labelKey="productLabel"
              colorClass="bg-slate-700"
              emptyText="No product trend data available."
            />

            <BarChartCard
              title="State-wise Lead Division"
              data={analytics.stateDivision}
              labelKey="state"
              colorClass="bg-indigo-600"
              emptyText="No state-wise lead data available."
            />

            <BarChartCard
              title="Top Cities by Enquiries"
              data={analytics.topCities.map((item) => ({
                ...item,
                cityLabel: `${item.rank}. ${item.city}`
              }))}
              labelKey="cityLabel"
              colorClass="bg-amber-500"
              emptyText="No city trend data available."
            />

            <BarChartCard
              title="GST Profile Split"
              data={analytics.gstDivision}
              labelKey="type"
              colorClass="bg-emerald-600"
              emptyText="No GST split data available."
            />

            <RepeatEnquiriesCard data={analytics.repeatEnquirers} />
            <QuarterLeadListings
              selectedYear={yearlyAnalytics.selectedYear}
              quarterWise={yearlyAnalytics.quarterWise}
              loading={quarterAnalyticsLoading}
              onYearChange={onYearChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default LeadsAnalyticsSection;
