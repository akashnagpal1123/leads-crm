import { useEffect, useState } from "react";
import { fetchLeadFilterOptions } from "../services/api";

const EMPTY_FILTERS = {
  state: "",
  city: "",
  product: "",
  minQty: "",
  maxQty: "",
  organizationName: "",
  phone: "",
  leadType: "",
  gst: "",
  year: "",
  startDate: "",
  endDate: ""
};

const inputClassName =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#29ab87] focus:ring-2 focus:ring-[#29ab87]/25";

const Filters = ({ onApply }) => {
  const [local, setLocal] = useState(EMPTY_FILTERS);
  const [leadTypes, setLeadTypes] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetchLeadFilterOptions();
        setLeadTypes(res.data.leadTypes ?? []);
        setYears(res.data.years ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "year" && value) {
        next.startDate = "";
        next.endDate = "";
      }
      if ((name === "startDate" || name === "endDate") && value) {
        next.year = "";
      }
      return next;
    });
  };

  const buildPayload = (filters) => {
    const payload = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value != null) {
        payload[key] = value;
      }
    });
    return payload;
  };

  const handleApply = () => {
    onApply(buildPayload(local));
  };

  const handleClear = () => {
    setLocal({ ...EMPTY_FILTERS });
    onApply({});
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          name="state"
          placeholder="State"
          value={local.state}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="city"
          placeholder="City"
          value={local.city}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="product"
          placeholder="Product"
          value={local.product}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="minQty"
          type="number"
          placeholder="Min Qty"
          value={local.minQty}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="maxQty"
          type="number"
          placeholder="Max Qty"
          value={local.maxQty}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="organizationName"
          placeholder="Organization Name"
          value={local.organizationName}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={local.phone}
          onChange={handleChange}
          className={inputClassName}
        />
        <select
          name="leadType"
          value={local.leadType}
          onChange={handleChange}
          className={`${inputClassName} bg-white`}
        >
          <option value="">Lead Type (All)</option>
          {leadTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          name="gst"
          value={local.gst}
          onChange={handleChange}
          className={`${inputClassName} bg-white`}
        >
          <option value="">GST (All)</option>
          <option value="yes">GST Yes</option>
          <option value="no">GST No</option>
        </select>
        <select
          name="year"
          value={local.year}
          onChange={handleChange}
          className={`${inputClassName} bg-white`}
        >
          <option value="">Year (All)</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <input
          name="startDate"
          type="date"
          value={local.startDate}
          onChange={handleChange}
          disabled={Boolean(local.year)}
          className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
        />
        <input
          name="endDate"
          type="date"
          value={local.endDate}
          onChange={handleChange}
          disabled={Boolean(local.year)}
          className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
        />
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-lg bg-[#29ab87] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#239675]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
