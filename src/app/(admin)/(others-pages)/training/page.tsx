'use client';
import { TrainingModel } from "@/models/domain/TrainingModel";
import TrainingSessionService from "@/service/TrainingSessionService";
import { useEffect, useState } from "react"
import { Button, Table, Text, TextInput, Title } from "@mantine/core";
import LineChartOne from "@/components/charts/line/LineChartOne";
import { SeriesType } from "@/components/charts/interface/SeriesType";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import TablePagination from "@/components/tables/Pagination";


export default function TrainingPage(){
    const [trainingSessionData, setTrainingSessionData] = useState<TrainingModel[]>([]);
    const [currentPaginationIndex, setCurrentPaginationIndex] = useState<number>(1);
    const [selectedIndex , setSelectedIndex] = useState<number>(0);
    const [chartData, setChartData] = useState<SeriesType[]>([]);
    const [searchKey, setSearchKey] = useState<string>("");
    const numOfDataPerPage = 10;
    const xLabel : string[] = ["Plastik", "Kertas", "Kaca",  "Logam", "Kardus","Sampah"];

    useEffect(()=>{
        TrainingSessionService.getAllTrainingData().then((response)=>{
            console.log(response.data);
            if(response.data){
                setTrainingSessionData(response.data)
                setChartDataByIndex(0);
            }
        })
    },[]);

    useEffect(()=>{
        setChartDataByIndex(0);
    },[trainingSessionData]);

    function setChartDataByIndex(index : number){
        if(trainingSessionData.length> 0){
            setChartData(
                [
                    {
                        series :"data",
                        data : trainingSessionData[index].loss.map((number)=>Number(number.toFixed(5)))
                    }
                ]
            )
        }
    }

    return (
        <div className="">
            <div className="w-full mt-5 flex rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 gap-5 justify-between items-center">
                <div className="">
                    <Title order={3}>Current Training</Title>
                    <Text>Anda sudah bisa melakukan agregasi model </Text>
                </div>
                <Button>Training</Button>
            </div>

            <div className="grid grid-cols-[40%_auto] gap-10">
                <div className="w-full mt-5 rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                    <div className="grid grid-cols-1 gap-5">
                        <Title order={3}>Distribusi Label</Title>
                        <BarChartOne x_label={xLabel} data={trainingSessionData[selectedIndex] ? trainingSessionData[selectedIndex].label_count : []}/>

                        <Title order={3}>Loss Grafik</Title>
                        <LineChartOne data={chartData}></LineChartOne>
                    </div>
                </div>
                <div>
                    <div className="flex justify-end items-center w-full gap-3 mb-5 mt-3"> 
                        <Title order={5}>Search : </Title>
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
                            <Table.Th >No.</Table.Th>
                            <Table.Th >Rata-rate Loss</Table.Th>
                            <Table.Th >Jumlah Data</Table.Th>
                            <Table.Th >Status</Table.Th>
                            <Table.Th >Created At</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {trainingSessionData.map((item, index) => {
                            if(index < (numOfDataPerPage * (currentPaginationIndex-1)) || index >= (numOfDataPerPage*currentPaginationIndex)) return 
                            return (
                            <Table.Tr 
                                key={index} 
                                onClick={() => {
                                    setSelectedIndex(index)
                                    setChartDataByIndex(index)
                                }}
                                bg={selectedIndex === index ? 'blue.1' : undefined} // Cara Mantine
                                style={{ cursor: 'pointer' }}
                            >
                                <Table.Td >{index + 1}</Table.Td>
                                <Table.Td >{item.average_loss}</Table.Td>
                                <Table.Td >{item.num_data}</Table.Td>
                                <Table.Td >{item.status}</Table.Td>
                                <Table.Td >{item.created_at.slice(0,19)}</Table.Td>
                            </Table.Tr>
                            )
                        }
                        )}
                    </Table.Tbody>
                </Table>
                <TablePagination totalData={trainingSessionData.length} totalPages={trainingSessionData.length/numOfDataPerPage} currentPage={currentPaginationIndex} onPageChange={(number)=>setCurrentPaginationIndex(number)}/>
                </div>
            </div>
        </div>
    )
}