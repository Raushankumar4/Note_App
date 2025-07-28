import React from "react";
import { useLocation } from "react-router-dom";

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  type?: "submit" | "button";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  type = "submit",
}) => {
  const location = useLocation();
  const hideSpinner = location.pathname === "/dashboard";
  return (
    <button
      type={type}
      className="mt-2 tracking-wide font-semibold text-sm bg-indigo-500 text-white w-full py-3 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none disabled:opacity-70"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {!hideSpinner && (
            <svg
              className="w-5 h-5 -ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          )}
          <span className="ml-2">{text}</span>
        </>
      )}
    </button>
  );
};

export default LoadingButton;
