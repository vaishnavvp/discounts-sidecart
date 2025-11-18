import React from "react";

function HollowDot({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CheckDot({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="12" />
      <path
        d="M7 12.5l3 3 7-7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  value: "one-time" | "monthly";
  onChange: (v: "one-time" | "monthly") => void;
};

export default function PriceTypeToggle({ value, onChange }: Props) {
  return (
    <div className="mt-2 flex gap-4">
      {/* One time price */}
      <button
        type="button"
        onClick={() => onChange("one-time")}
        className={[
          "flex w-48 items-center justify-between rounded-md px-6 py-4 transition-colors",
          value === "one-time"
            ? "bg-[#cd2626] text-white"
            : "bg-[#ECECEC] text-[#767676]",
        ].join(" ")}
      >
        <span className="text-[16px] font-medium">One time price</span>
        {value === "one-time" ? (
          <span className="text-white">
            <img
                src="/images/Radio.svg"
                alt="Average icon"
                className="h-6 w-6 cursor-pointer"
              />
          </span>
        ) : (
          <span className="text-gray-400">
                <img
                src="/images/circle.svg"
                alt="icon"
                className="h-6 w-6 cursor-pointer"
              />          </span>
        )}
      </button>

      {/* Monthly price */}
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={[
          "flex w-48 items-center justify-between rounded-md px-6 py-4 transition-colors",
          value === "monthly"
            ? "bg-[#cd2626] text-white"
            : "bg-[#ECECEC] text-[#767676]",
        ].join(" ")}
      >
        <span className="text-[16px] font-medium">Monthly price</span>
        {value === "monthly" ? (
          <img
                src="/images/Radio.svg"
                alt="icon"
                className="h-6 w-6 cursor-pointer"
              />
        ) : (
          <span className="text-gray-400">
<img
                src="/images/circle.svg"
                alt="icon"
                className="h-6 w-6 cursor-pointer"
              />          </span>
        )}
      </button>
    </div>
  );
}
