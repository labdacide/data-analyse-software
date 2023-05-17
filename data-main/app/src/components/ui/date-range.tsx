import { useState } from "react";

interface DateRangeProps {
  range: { start: string; end: string };
  onChange: (key: "start" | "end", value: string) => void;
}

export default function DateRange({ range, onChange }: DateRangeProps) {
  return (
    <div className="text-xs flex space-x-2 items-center">
      <input
        type="date"
        name="start"
        value={range.start}
        onChange={(e) => onChange("start", e.target.value)}
        className="bg-transparent text-gray-500 font-light focus:outline-none py-0.5 w-[94px]"
      />
      <span>{"→"}</span>
      <input
        type="date"
        name="end"
        value={range.end}
        onChange={(e) => onChange("end", e.target.value)}
        className="bg-transparent text-gray-500 font-light focus:outline-none py-0.5 w-[94px]"
      />
    </div>
  );
}
