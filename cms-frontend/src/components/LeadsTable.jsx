const formatCreatedAt = (lead) => {
  const rawDate = lead?.timestamps?.createdAt || lead?.createdAt;
  if (!rawDate) return "-";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN");
};

const LeadsTable = ({ leads, page = 1, limit = 50 }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Lead Type</th>
              <th className="px-4 py-3">GST</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">WhatsApp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                  No leads found for the selected filters.
                </td>
              </tr>
            ) : (
              leads.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {l.contactName || "-"}
                  </td>
                  <td className="px-4 py-3">{l.organisationName || "-"}</td>
                  <td className="px-4 py-3">{l.leadSource || "-"}</td>
                  <td className="px-4 py-3">{l.gst ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{formatCreatedAt(l)}</td>
                  <td className="px-4 py-3">{l.phone || "-"}</td>
                  <td className="px-4 py-3">{l.location?.city || "-"}</td>
                  <td className="px-4 py-3">{l.location?.state || "-"}</td>
                  <td className="px-4 py-3">{l.product?.subject || "-"}</td>
                  <td className="px-4 py-3">{l.budget?.quantity || "-"}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/91${l.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#29ab87] hover:text-[#239675]"
                    >
                      Chat
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
