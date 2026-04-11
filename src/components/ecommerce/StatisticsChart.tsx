"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";
import ModelEvaluationService from "@/service/ModelEvaluationService";
import ModelEvaluation from "@/models/domain/ModelEvaluation";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [modelEvaluationData, setModelEvaluationData] = useState<ModelEvaluation>({ accuracy : [], error_rate : [], precision : [], recall : [] , f1_score :[] , confussion_matrix: []})

  useEffect(()=>{
    ModelEvaluationService.getModelEvaluationData()?.then( (data) => {
      const modelEvaluationData : ModelEvaluation = { accuracy : [], error_rate : [], precision : [], recall : [] , f1_score :[] , confussion_matrix: []}
      data?.forEach((modelEvaluation)=>{

          const averageAccurac = modelEvaluation.accuracy.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue;
          },0) /6;
          const averageErrorRate = modelEvaluation.error_rate.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue;
          },0) /6;
          const averagePrecission = modelEvaluation.precision.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue;
          },0) /6;
          const averageRecall = modelEvaluation.recall.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue;
          },0) /6;
          const averageF1Score = modelEvaluation.f1_score.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue;
          },0) /6;

          modelEvaluationData.accuracy.push(Number(averageAccurac.toFixed(2)))
          modelEvaluationData.precision.push(Number(averagePrecission.toFixed(2)))
          modelEvaluationData.error_rate.push(Number(averageErrorRate.toFixed(2)))
          modelEvaluationData.recall.push(Number(averageRecall.toFixed(2)))
          modelEvaluationData.f1_score.push(Number(averageF1Score.toFixed(2)))
      })
      setModelEvaluationData(modelEvaluationData)
      console.log(modelEvaluationData)
    })
  },[]);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#00c42e", "#d1001f", "#d1001f", "#d1ae00", "#004bd6"], // Define line colors
    chart: {
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
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Akurasi",
      data: modelEvaluationData?.accuracy,
    },
    {
      name: "Error Rate",
      data: modelEvaluationData?.error_rate,
    },
    {
      name: "Precision",
      data: modelEvaluationData?.precision,
    },
    {
      name: "Recall",
      data: modelEvaluationData?.recall,
    },
    {
      name: "F1 Score",
      data: modelEvaluationData?.f1_score,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Grafik Pelatihan
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Grafik pelatihan model EfficientNet-B0 yang menunjukkan akurasi dan loss selama proses pelatihan.
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2  text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 lg:w-40 lg:h-auto  lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}