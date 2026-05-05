import React, { useState } from "react";

interface Props {
  selected: number[];
  setSelected: (val: number[]) => void;
}

const GraphTab: React.FC<Props> = ({ selected, setSelected }) => {
  const getButtonClass = (option: number) =>
    selected.includes(option)
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

    const addSelected = (option: number) => {
      if (option === 1) {
        setSelected(selected.includes(1) ? [] : [1])
      } else {
        const newSelected = selected.includes(option) ? selected.filter((val) => val !== option) : [...selected.filter((val) => val !== 1), option];
        if(newSelected.length === 0){
          newSelected.push(1)
        }
        setSelected(newSelected);
      }

    }

  const options = [
    { label: "All", value: 1 },
    { label: "Accuracy", value: 2 },
    { label: "Error Rate", value: 3 },
    { label: "Precision", value: 4 },
    { label: "Recall", value: 5 },
    { label: "F1 Score", value: 6 },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button    
        onClick={() => addSelected(1)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          1
        )}`}
      >
        All
      </button>

      <button
        onClick={() => addSelected(2)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          2
        )}`}
      >
        Accuracy
      </button>

      <button
        onClick={() => addSelected(3    )}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 text-nowrap  dark:hover:text-white ${getButtonClass(
          3
        )}`}
      >
        Error Rate
      </button>

      <button
        onClick={() => addSelected(4)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 text-nowrap  dark:hover:text-white ${getButtonClass(
          4
        )}`}
      >
        Precision
      </button>

       <button
        onClick={() => addSelected(5)}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900  text-nowrap dark:hover:text-white ${getButtonClass(
          5
        )}`}
      >
        Recall
      </button>

       <button
        onClick={() => addSelected(6)}
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
