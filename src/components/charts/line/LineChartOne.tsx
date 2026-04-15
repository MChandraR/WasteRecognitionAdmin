"use client";
import React from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { SeriesType } from "../interface/SeriesType";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


interface LineChartOneProps{
  data : SeriesType[]
}


const LineChartOne: React.FC<LineChartOneProps> = ({
  data
})=>{
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      animations : {
        enabled : data.length > 0 ? data[0].data.length < 200 : false
      },
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category",
      // Membatasi jumlah label yang muncul agar tidak menumpuk
      // Jika data 100, tickAmount 10 akan memunculkan label setiap 10 data
      tickAmount: Math.ceil( (data.length>0 ? data[0].data.length : 0) / 10), 
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        // Formatter untuk membatasi panjang karakter
        formatter: (value) => {
          const valString = String(value);
          if (valString.length > 5) {
            return valString.substring(0, 5) + "...";
          }
          return valString;
        },
      },
      title: {
        style: { fontSize: "0px" },
      },
    },
    
  };

  return (
    <div className="max-w-full  overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="max-w-full">
        <ReactApexChart
          options={options}
          series={data}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
}

export default LineChartOne;
