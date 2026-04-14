import { ApexOptions } from "apexcharts";

const options: ApexOptions = {
        colors: ["#465fff"],
        chart: {
          fontFamily: "Outfit, sans-serif",
          type: "bar",
          height: 180,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "39%",
            borderRadius: 5,
            borderRadiusApplication: "end",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 4,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Plastik",
            "Kertas",
            "Kaca",
            "Logam",
            "Kardus",
            "Trash"
          ],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          fontFamily: "Outfit",
        },
        yaxis: {
            show : false,
          title: {
            text: undefined,
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        fill: {
          opacity: 1,
        },
    
        tooltip: {
          x: {
            show: false,
          },
          y: {
            formatter: (val: number) => `${val}`,
          },
        },
      };

export default options;