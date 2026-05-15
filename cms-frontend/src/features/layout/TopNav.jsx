const TopNav = () => {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29ab87]">
            Gaffni
          </p>
          <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
            CRM Panel
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Welcome, Team
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Profile
          </div>
        </div>

      </div>
    </nav>
  );
};

export default TopNav;
