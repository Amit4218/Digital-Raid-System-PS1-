import React, { useState } from "react";

const links = [
  {
    label: "Act",
    url: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Portal_Acts_Rules_Cirular.aspx?type=33",
  },
  {
    label: "Rules",
    url: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Portal_Acts_Rules_Cirular.aspx?type=42",
  },
  {
    label: "Circulars",
    url: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Portal_Acts_Rules_Cirular.aspx?type=47",
  },
  {
    label: "Other Documents",
    url: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Portal_Acts_Rules_Cirular.aspx?type=48",
  },
];

const ChevronDown = ({ className = "" }) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUp = ({ className = "" }) => (
  <svg
    className={`w-4 h-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const ActRulesOrders = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 rounded-md flex items-center gap-2 border border-white bg-lime-700 text-white transition duration-200"
      >
        {/* Icon/logo placeholder if needed */}
        {/* <img src="/path/to/icon.svg" alt="icon" className="w-4 h-4" /> */}
        <span>Act, Rules & Orders</span>
        <span className="ml-1">
          {open ? <ChevronUp className="text-red-600" /> : <ChevronDown />}
        </span>
      </button>

      <div
        className={`absolute mt-2 bg-white text-black rounded-md shadow-lg min-w-[250px] z-10 transition-all duration-300 transform origin-top ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ border: "2px solid #22543d" }}
      >
        {links.map(({ label, url }, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm whitespace-nowrap hover:bg-green-200"
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ActRulesOrders;
