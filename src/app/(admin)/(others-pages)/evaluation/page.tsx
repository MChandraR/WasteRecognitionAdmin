'use client';
import ConfusionMatrix from "@/components/charts/matrix/ConfusionMatrix";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import ModelEvaluation from "@/models/domain/ModelEvaluation";
import ModelEvaluationService from "@/service/ModelEvaluationService";
import { Divider, SegmentedControl, Table, Title, Pagination } from "@mantine/core";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Metric1D = Exclude<keyof ModelEvaluation, 'confusion_matrix'>;

export default function ModelEvaluationPage() {
    const [evalData, setEvalData] = useState<ModelEvaluation[]>([]); // Simpan data aslinya
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedConfusionMatrix, setSelectedConfusionMatrix] = useState<Array<Array<number>>>([[]])
    const labels = ["Plastik", "Kertas", "Kaca", "Logam", "Kardus", "Lainnya"];
    const [value, setValue] = useState<string>('akurasi');
    const [distributedLabel, setDistributedLabel] = useState<Array<number>>()

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

      const series = [
        {
          name: "Sales",
          data: distributedLabel,
        },
      ];


    useEffect(() => {
        ModelEvaluationService.getModelEvaluationData().then((data) => {
            setEvalData(data || []);
            if(data){
                setSelectedConfusionMatrix(data[0].confusion_matrix);
                setDistributedLabel(data[0]["accuracy" as Metric1D])
            }
        });
    }, []);

    const getAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return (
        <div>
            <PageBreadcrumb pageTitle="Model Evaluation" />

            <StatisticsChart/>


            <div className="w-full mt-5 flex rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                <div className="w-2/5   ">
                    <Title order={2} className="pb-5">Confusion Matrix</Title>

                    <div className="mb-5">
                        <ConfusionMatrix matrixData={selectedConfusionMatrix} labels={labels}/>
                    </div>

                    <Title order={2} className="pb-5 ">Statistik</Title>
                    <SegmentedControl
                        value={value}
                        onChange={(value)=>{
                            setDistributedLabel(evalData[selectedId ?? 0][value as Metric1D])
                            console.log(value)
                            setValue(value)
                        }}
                        data={[
                            { label: 'Akurasi', value: 'accuracy' },
                            { label: 'Error Rate', value: 'error_rate' },
                            { label: 'Precision', value: 'precision' },
                            { label: 'Recall', value: 'recall' },
                            { label: 'F1 Score', value: 'f1_score' },
                        ]}
                        />

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                        <ReactApexChart
                            options={options}
                            series={
                            [
                                {
                                name: "Sales",
                                data: distributedLabel ?? [],
                                },
                            ]
                            }
                            type="bar"
                            height={180}
                        />
                        </div>
                    </div>
                </div>
                <Divider orientation="vertical"></Divider>
                <div className="w-3/5 ml-10">
                    <Title order={2} className="pb-2">Evaluation Data ( Based on Round) </Title>
                    <Divider className="pb-5"></Divider>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="text-lg">No.</Table.Th>
                                <Table.Th className="text-lg">Accuracy</Table.Th>
                                <Table.Th className="text-lg">Error Rate</Table.Th>
                                <Table.Th className="text-lg">Precision</Table.Th>
                                <Table.Th className="text-lg">Recall</Table.Th>
                                <Table.Th className="text-lg">F1 Score</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {evalData.map((item, index) => (
                                <Table.Tr 
                                    key={index} 
                                    onClick={() => {
                                        setSelectedId(index)
                                        setSelectedConfusionMatrix(evalData[index].confusion_matrix)
                                        setDistributedLabel(evalData[selectedId ?? 0][value as Metric1D])
                                    }}
                                    bg={selectedId === index ? 'blue.1' : undefined} // Cara Mantine
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Table.Td className="text-lg">{index + 1}</Table.Td>
                                    <Table.Td className="text-lg">{getAvg(item.accuracy).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg">{getAvg(item.error_rate).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg">{getAvg(item.precision).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg">{getAvg(item.recall).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg">{getAvg(item.f1_score).toFixed(4)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
            </div>



            {/* ... Breadcrumb ... */}
            
        </div>
    );
}