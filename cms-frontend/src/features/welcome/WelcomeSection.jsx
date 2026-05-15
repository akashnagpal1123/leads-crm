const WelcomeSection = ({ onOpenLeadManagement }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29ab87]">
        Welcome
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
        Welcome to Leads Management
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
        Use the sidebar to open the Lead Management section. From there, you can
        filter leads, browse entries, and connect with prospects quickly.
      </p>
      <button
        type="button"
        onClick={onOpenLeadManagement}
        className="mt-6 rounded-lg bg-[#29ab87] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#239675]"
      >
        Open Lead Management
      </button>
    </div>
  );
};

export default WelcomeSection;
