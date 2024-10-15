export const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <svg
        className="animate-spin h-8 w-8 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8v8H4z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
};
