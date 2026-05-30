'use client';
import ConfusionMatrix from "@/components/charts/matrix/ConfusionMatrix";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import ModelEvaluation from "@/models/domain/ModelEvaluation";
import ModelEvaluationService from "@/service/ModelEvaluationService";
import { Divider, SegmentedControl, Table, Title, TextInput , Text} from "@mantine/core";
import options from "../../../../components/charts/options/EvaluationChartOption";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import TablePagination from "@/components/tables/Pagination";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Metric1D = Exclude<keyof ModelEvaluation, 'confusion_matrix'>;

export default function ModelEvaluationPage() {
    const [evalData, setEvalData] = useState<ModelEvaluation[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedConfusionMatrix, setSelectedConfusionMatrix] = useState<Array<Array<number>>>([[]])
    const labels = ["Plastik", "Kertas", "Kaca", "Logam", "Kardus", "Lainnya"];
    const [value, setValue] = useState<string>('accuracy');
    const [distributedLabel, setDistributedLabel] = useState<Array<number>>()
    const [searchKey, setSearchKey] = useState<string>("");
    const [currentPaginationIndex, setCurrentPaginationIndex] = useState<number>(1);
    const numOfDataPerPage = 6;

    useEffect(() => {
        ModelEvaluationService.getModelEvaluationData().then((data) => {
            setEvalData(data || []);
            if(data && data.length > 0){
                setSelectedConfusionMatrix(data[0].confusion_matrix);
                setDistributedLabel(data[0]["accuracy" as Metric1D]);
                setSelectedId(0);
            }
        });
    }, []);

    // FUNGSI BARU: Menghitung Weighted Average berdasarkan Confusion Matrix
    const getWeightedAvg = (metricArr: number[], matrix: number[][]) => {
        if (!matrix || matrix.length === 0 || !metricArr || metricArr.length !== matrix.length) return 0;

        let totalSupport = 0;
        let weightedSum = 0;
        let f1ScoreSum = 0;

        for (let i = 0; i < matrix.length; i++) {
            // Menghitung jumlah aktual data per kelas (support) dari baris matrix
            // Asumsi: Baris = True Label, Kolom = Predicted Label
            const classSupport = matrix[i].reduce((sum, val) => sum + val, 0);
            
            totalSupport += classSupport;
            f1ScoreSum += metricArr[i]  // Mengalikan metric dengan support untuk mendapatkan weighted sum
            weightedSum += (metricArr[i] * classSupport);
        }

        return f1ScoreSum / matrix.length;
        return totalSupport === 0 ? 0 : (weightedSum / totalSupport);
    };

    const getAccuracy  = (arr:number[][]) =>{
        let totalCorrect : number = 0;
        let totalData : number = 0;
        for(let i = 0; i < arr.length ; i++){
            for(let j = 0 ; j< arr.length ; j++){
                totalData += arr[i][j];
            }
            totalCorrect += arr[i][i];
        }
        return totalData === 0 ? 0 : totalCorrect/totalData;
    };

    const getLoss  = (arr:number[][]) =>{
        let totalIncorrect : number = 0;
        let totalData : number = 0;
        for(let i = 0; i < arr.length ; i++){
            for(let j = 0 ; j< arr.length ; j++){
                totalData += arr[i][j];
                if(i !== j){
                    totalIncorrect += arr[i][j];
                }
            }
        }
        return totalData === 0 ? 0 : totalIncorrect/totalData;
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Model Evaluation" />

            <StatisticsChart/>

            <div className="w-full mt-5 rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                <div className="w-full flex">
                    <div className="w-1/2 pr-10">
                        <Title order={2} className="pb-5 text-gray-800 dark:text-white/90">Confusion Matrix</Title>

                        <div className="mb-5">
                            <ConfusionMatrix matrixData={selectedConfusionMatrix} labels={labels}/>
                        </div>
                    </div>

                    <div className="w-1/2 border-l border-gray-200 dark:border-gray-800 pl-10">
                        <Title order={2} className="pb-5 text-gray-800 dark:text-white/90 ">Statistik</Title>
                        <SegmentedControl
                            value={value}
                            onChange={(val)=>{
                                if (evalData.length > 0 && selectedId !== null) {
                                    setDistributedLabel(evalData[selectedId][val as Metric1D]);
                                }
                                setValue(val);
                            }}
                            data={[
                                { label: 'Akurasi', value: 'accuracy' },
                                { label: 'Error Rate', value: 'error_rate' },
                                { label: 'Precision', value: 'precision' },
                                { label: 'Recall', value: 'recall' },
                                { label: 'F1 Score', value: 'f1_score' },
                            ]}
                            />
                        <Title order={5} className="pt-4 pl-2 font-normal text-gray-800 dark:text-white/90"> *semakin {value === 'accuracy' || value === 'precision' || value === 'recall' || value === 'f1_score' ? 'tinggi' : 'rendah'} lebih baik</Title>

                        <div className="max-w-full overflow-x-hidden custom-scrollbar">
                            <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2 pt-10">
                            <ReactApexChart
                                options={options}
                                series={[
                                    {
                                        name: "Value",
                                        data: distributedLabel ?? [],
                                    },
                                ]}
                                type="bar"
                                height={350}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10">
                    <Title order={3} className="pb-2 text-gray-800 dark:text-white/90">Evaluation Data (Based on Round) </Title>
                    <Divider className="pb-5"></Divider>

                    <div className="flex justify-end items-center w-full gap-3 mb-5 mt-3"> 
                      <Title className="text-gray-800 dark:text-white/90" order={5}>Search : </Title>
                      <TextInput
                        className="w-full sm:w-1/2 lg:w-1/3"
                        value={String(searchKey)}
                        onChange={(event) => setSearchKey(event.currentTarget.value)}
                        placeholder="Masukkan kata kunci pencarian"
                      />
                    </div>

                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">No.</Table.Th>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">Accuracy</Table.Th>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">Error Rate</Table.Th>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">Precision (W.A)</Table.Th>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">Recall (W.A)</Table.Th>
                                <Table.Th className="text-lg text-gray-800 dark:text-white/90">F1 Score (W.A)</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {evalData.map((item, index) => {
                              if(index < (numOfDataPerPage * (currentPaginationIndex-1)) || index >= (numOfDataPerPage*currentPaginationIndex)) return null;
                              
                              return (
                                <Table.Tr 
                                    key={index} 
                                    onClick={() => {
                                        setSelectedId(index);
                                        setSelectedConfusionMatrix(item.confusion_matrix);
                                        setDistributedLabel(item[value as Metric1D]);
                                    }}
                                    bg={selectedId === index ? 'blue.1' : undefined}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{index + 1}</Table.Td>
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{getAccuracy(item.confusion_matrix).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{getLoss(item.confusion_matrix).toFixed(4)}</Table.Td>
                                    {/* MENGGUNAKAN getWeightedAvg di sini */}
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{getWeightedAvg(item.precision, item.confusion_matrix).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{getWeightedAvg(item.recall, item.confusion_matrix).toFixed(4)}</Table.Td>
                                    <Table.Td className="text-lg text-gray-800 dark:text-white/90">{getWeightedAvg(item.f1_score, item.confusion_matrix).toFixed(4)}</Table.Td>
                                </Table.Tr>
                              )
                            }
                            )}
                        </Table.Tbody>
                    </Table>
                   <TablePagination currentPage={currentPaginationIndex} totalPages={Math.ceil(evalData.length/numOfDataPerPage)} totalData={evalData.length} onPageChange={(idx)=>setCurrentPaginationIndex(idx)}/>
                </div>
            </div>
        </div>
    );
}