'use client';
import ConfusionMatrix from "@/components/charts/matrix/ConfusionMatrix";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModelEvaluation from "@/models/domain/ModelEvaluation";
import ModelEvaluationService from "@/service/ModelEvaluationService";
import { Table } from "@mantine/core";
import { useEffect, useState } from "react";

export default function ModelEvaluationPage() {
    const [evalData, setEvalData] = useState<ModelEvaluation[]>([]); // Simpan data aslinya
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedConfusionMatrix, setSelectedConfusionMatrix] = useState<Array<Array<number>>>([[]])
    const labels = ["Plastik", "Kertas", "Kaca", "Logam", "Kardus", "Lainnya"];

    useEffect(() => {
        ModelEvaluationService.getModelEvaluationData().then((data) => {
            setEvalData(data || []);
            if(data){
                setSelectedConfusionMatrix(data[0].confusion_matrix);
            }
        });
    }, []);

    // Fungsi helper untuk hitung rata-rata
    const getAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return (
        <div>
            <PageBreadcrumb pageTitle="Model Evaluation" />

            <div className="w-full rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                <div className="w-1/2">
                    <ConfusionMatrix matrixData={selectedConfusionMatrix} labels={labels}/>
                </div>
            </div>
            {/* ... Breadcrumb ... */}
            <Table highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>No.</Table.Th>
                        <Table.Th>Accuracy</Table.Th>
                        <Table.Th>Error Rate</Table.Th>
                        <Table.Th>Precision</Table.Th>
                        <Table.Th>Recall</Table.Th>
                        <Table.Th>F1 Score</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {evalData.map((item, index) => (
                        <Table.Tr 
                            key={index} 
                            onClick={() => {
                                setSelectedId(index)
                                setSelectedConfusionMatrix(evalData[index].confusion_matrix)
                            }}
                            bg={selectedId === index ? 'blue.1' : undefined} // Cara Mantine
                            style={{ cursor: 'pointer' }}
                        >
                            <Table.Td>{index + 1}</Table.Td>
                            <Table.Td>{getAvg(item.accuracy).toFixed(4)}</Table.Td>
                            <Table.Td>{getAvg(item.error_rate).toFixed(4)}</Table.Td>
                            <Table.Td>{getAvg(item.precision).toFixed(4)}</Table.Td>
                            <Table.Td>{getAvg(item.recall).toFixed(4)}</Table.Td>
                            <Table.Td>{getAvg(item.f1_score).toFixed(4)}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
}