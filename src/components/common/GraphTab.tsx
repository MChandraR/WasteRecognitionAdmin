import React, { useState } from "react";

interface Props {
  selected: number;
  setSelected: (val: number) => void;
}

const GraphTab: React.FC<Props> = ({ selected, setSelected }) => {
  const getButtonClass = (option: number) =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button    
        onClick={() => setSelected(1)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          1
        )}`}
      >
        All
      </button>

      <button
        onClick={() => setSelected(2)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          2
        )}`}
      >
        Accuracy
      </button>

      <button
        onClick={() => setSelected(3)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 text-nowrap  dark:hover:text-white ${getButtonClass(
          3
        )}`}
      >
        Error Rate
      </button>

      <button
        onClick={() => setSelected(4)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 text-nowrap  dark:hover:text-white ${getButtonClass(
          4
        )}`}
      >
        Precision
      </button>

       <button
        onClick={() => setSelected(5)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900  text-nowrap dark:hover:text-white ${getButtonClass(
          5
        )}`}
      >
        Recall
      </button>

       <button
        onClick={() => setSelected(6)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900  text-nowrap dark:hover:text-white ${getButtonClass(
          6
        )}`}
      >
        F1 Score
      </button>
    </div>
  );
};

export default GraphTab;
