const BarChartCard = ({
  title,
  totalLabel,
  data,
  labelKey,
  valueKey = "count",
  colorClass = "bg-[#29ab87]",
  emptyText = "No data available."
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {totalLabel ? (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {totalLabel}
        </span>
      ) : null}
    </div>

    {data.length === 0 ? (
      <p className="text-sm text-slate-500">{emptyText}</p>
    ) : (
      <div className="space-y-4">
        {data.map((item) => (
          <div key={`${title}-${item[labelKey]}`}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item[labelKey]}</span>
              <span className="text-slate-500">
                {item[valueKey]} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${colorClass}`}
                style={{ width: `${Math.max(item.percentage, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default BarChartCard;
