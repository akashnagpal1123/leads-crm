const RepeatEnquiriesCard = ({ data }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-slate-900">
      Repeat Enquiry Organizations / Contacts
    </h3>

    {data.length === 0 ? (
      <p className="text-sm text-slate-500">No repeat enquiries found yet.</p>
    ) : (
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={`repeat-${item.rank}-${item.contactName}-${item.organisationName}`}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">
                {item.rank}. {item.organisationName}
              </p>
              <span className="rounded-full bg-[#29ab87] px-2.5 py-1 text-xs font-semibold text-white">
                {item.enquiries} enquiries
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Contact: {item.contactName}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RepeatEnquiriesCard;
