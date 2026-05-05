'use client';
import { TrainingModel } from "@/models/domain/TrainingModel";
import TrainingSessionService from "@/service/TrainingSessionService";
import { useEffect, useState } from "react"
import { Button, Table, Text, TextInput, Title, useMantineColorScheme } from "@mantine/core";
import LineChartOne from "@/components/charts/line/LineChartOne";
import { SeriesType } from "@/components/charts/interface/SeriesType";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import TablePagination from "@/components/tables/Pagination";
import { formatTimestamp } from "@/util/DateUtil";


export default function TrainingPage(){
    const [trainingSessionData, setTrainingSessionData] = useState<TrainingModel[]>([]);
    const [currentPaginationIndex, setCurrentPaginationIndex] = useState<number>(1);
    const [selectedIndex , setSelectedIndex] = useState<number>(0);
    const [chartData, setChartData] = useState<SeriesType[]>([]);
    const [searchKey, setSearchKey] = useState<string>("");
    const numOfDataPerPage = 10;
    const xLabel : string[] = ["Plastik", "Kertas", "Kaca",  "Logam", "Kardus","Sampah"];
    const { setColorScheme } = useMantineColorScheme();

    useEffect(() => {
    // Fungsi untuk mengecek tema dari Tailwind/LocalStorage
    const syncTheme = () => {
        const savedTheme = localStorage.getItem('theme'); // Sesuaikan key localStorage admin kamu
        const isDark = document.documentElement.classList.contains('dark') || savedTheme === 'dark';
        
        setColorScheme(isDark ? 'dark' : 'light');
    };

    // 1. Jalankan saat pertama kali load
    syncTheme();

    // 2. Pantau perubahan class pada <html> (jika admin pakai class mutation)
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    return () => observer.disconnect();
    }, [setColorScheme]);


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
                    <Title order={3} className="text-gray-800 dark:text-white/90">Current Training</Title>
                    <Text className="text-gray-800 dark:text-white/50">Anda sudah bisa melakukan agregasi model </Text>
                </div>
                <Button color="indigo">Training</Button>
            </div>

            <div className="">
                <div className="w-full grid grid-cols-2 mt-5 rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                    <div className="grid grid-cols-1 gap-5 overflow-x-hidden">
                        <Title order={3} className="text-gray-800 dark:text-white/90">Loss Grafik</Title>
                        <LineChartOne data={chartData} height={300}></LineChartOne>
                    </div>
                    <div className="grid grid-cols-1 gap-5 overflow-x-hidden">
                        <Title order={3} className="text-gray-800 dark:text-white/90">Distribusi Label</Title>
                        <BarChartOne x_label={xLabel} data={trainingSessionData[selectedIndex] ? trainingSessionData[selectedIndex].label_count : []} height={310}/>
                    </div>

                </div>
                <div className="bg-white dark:bg-gray-dark p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-start justify-between flex-nowrap pt-5">
                        <Title order={3} className="text-nowrap  whitespace-nowrap flex-nowrap">Training Data</Title>
                        <div className="flex w-3/5 justify-end items-center  gap-3 mb-10 "> 
                            <Title className="text-gray-800 dark:text-white/90" order={5}>Search : </Title>
                            <TextInput
                            className="w-full sm:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-gray-800 "
                            value={String(searchKey)}
                            onChange={(event) => setSearchKey(event.currentTarget.value)}
                            placeholder="Masukkan kata kunci pencarian"
                            style={{
                                input : {
                                    backgroundColor : 'var(--color-custom-bg-light)'
                                }
                            }}
                            />
                        </div>
                    </div>
                   
                <Table highlightOnHover highlightOnHoverColor="bg-white p-5 dark:border-gray-800 "
                    styles={{
                        th: {
                        // Warna garis header
                        borderBottomColor: '#e03131',
                        },
                        td: {
                        // Warna garis antar baris dan kolom
                        borderColor: '#e03131',
                        },
                    }}
                    >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">No.</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">Loss</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">Jumlah Data</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg text-center">Iterasi</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">Status</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">Model Version</Table.Th>
                            <Table.Th className="text-gray-800 dark:text-white/90 text-lg">Created At</Table.Th>
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
                                className={selectedIndex === index ? 'bg-blue-900 dark:bg-blue-900' : ''}// Cara Mantine
                                style={{ cursor: 'pointer' }}
                            >
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{index + 1}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{item.last_loss}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{item.num_data}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{item.loss.length}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{item.status}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{item.model_version}</Table.Td>
                                <Table.Td className="text-gray-800 dark:text-white/90 text-lg ">{formatTimestamp(item.created_at)}</Table.Td>
                            </Table.Tr>
                            )
                        }
                        )}
                    </Table.Tbody>
                </Table>
                <TablePagination totalData={trainingSessionData.length} totalPages={Math.ceil(trainingSessionData.length/numOfDataPerPage)} currentPage={currentPaginationIndex} onPageChange={(number)=>setCurrentPaginationIndex(number)}/>
                </div>
            </div>
        </div>
    )
}