const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm font-medium text-slate-600">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="rounded-lg bg-[#29ab87] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#239675] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
