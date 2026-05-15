const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];

const QuarterLeadListings = ({
  availableYears,
  selectedYear,
  quarterWise,
  loading,
  onYearChange
}) => {
  const hasYears = availableYears.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 bg-gradient-to-r from-green-200 to-blue-100">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Lead Analytics by Quarter</h3>
          <p className="mt-1 text-sm text-slate-500">
            Filter by year to view top cities and products quarter-wise.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Year
          <select
            value={selectedYear ?? ""}
            onChange={(event) => onYearChange(Number(event.target.value))}
            className="min-w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-[#29ab87] transition focus:border-[#29ab87] focus:ring-2"
            disabled={!hasYears || loading}
          >
            {!hasYears ? <option value="">No year available</option> : null}
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading quarter analytics...</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-1">
          {QUARTER_ORDER.map((quarter) => {
            const quarterData = quarterWise[quarter] || {
              topCities: [],
              topProducts: [],
              totalLeads: 0
            };
            return (
              <div
                key={quarter}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">{quarter === "Q1" ? "Quarter 1: Jan - Mar" : quarter === "Q2" ? "Quarter 2: Apr - Jun" : quarter === "Q3" ? "Quarter 3: Jul - Sep" : "Quarter 4: Oct - Dec"}</h4>
                  <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    Total Leads: {quarterData.totalLeads || 0}
                  </span>
                </div>

                <div className="space-x-4 flex flex-col md:flex-row">
                  <div className="w-1/2">
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      Top 5 Cities by Leads
                    </p>
                    {quarterData.topCities.length === 0 ? (
                      <p className="text-xs text-slate-500">No city data available.</p>
                    ) : (
                      <div className="space-y-1.5 text-sm">
                        {quarterData.topCities.map((item, index) => (
                          <div
                            key={`${quarter}-city-${item.city}`}
                            className="flex items-center justify-between rounded-md bg-white px-3 py-2"
                          >
                            <span className="text-slate-700">
                              {index + 1}. {item.city}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {item.totalLeads}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-1/2">
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      Top Products by Leads
                    </p>
                    {quarterData.topProducts.length === 0 ? (
                      <p className="text-xs text-slate-500">No product data available.</p>
                    ) : (
                      <div className="space-y-1.5 text-sm">
                        {quarterData.topProducts.map((item, index) => (
                          <div
                            key={`${quarter}-product-${item.product}`}
                            className="flex items-center justify-between rounded-md bg-white px-3 py-2"
                          >
                            <span className="text-slate-700">
                              {index + 1}. {item.product}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {item.totalLeads}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuarterLeadListings;
