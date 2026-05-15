const SidebarMenu = ({ activeMenu, onMenuChange }) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:min-h-[calc(100vh-7.5rem)]">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Menu
      </p>
      <p className="mb-5 text-sm text-slate-500">
        Navigate your leads and campaign data.
      </p>
      <button
        type="button"
        onClick={() => onMenuChange("lead-management")}
        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
          activeMenu === "lead-management"
            ? "bg-[#29ab87] text-white shadow"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Lead Management
      </button>
      <button
        type="button"
        onClick={() => onMenuChange("leads-analytics")}
        className={`mt-3 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
          activeMenu === "leads-analytics"
            ? "bg-[#29ab87] text-white shadow"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Leads Analytics
      </button>
    </aside>
  );
};

export default SidebarMenu;
