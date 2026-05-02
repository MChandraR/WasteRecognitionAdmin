'use client'
import LineChartOne from "@/components/charts/line/LineChartOne";
import { TrainingModel } from "@/models/domain/TrainingModel";
import TrainingSessionService from "@/service/TrainingSessionService";
import { Button, Title, Text, Table, TableThead, TableTr, TableTd } from "@mantine/core";
import { useEffect, useState } from "react";
import { SeriesType } from "@/components/charts/interface/SeriesType";
import { TableBody } from "@/components/ui/table";
import UserService from "@/service/UserService";
import { UserStatisticResponse } from "@/models/APIResponse/UserStatisticResponse";

export default function AveraginPage(){
    const [trainingData, setTrainingData] = useState<TrainingModel[]>([]);
    const [userStatistic, setUserStatistic] = useState<UserStatisticResponse>();

    useEffect(()=>{
        TrainingSessionService.getAlPendinglTrainingData().then((response)=>{
            console.log(response);
            if(response.data)setTrainingData(response.data);
        });
    },[]);

    useEffect(()=>{
        UserService.getUserStatistics("true", {
            onSuccess : (data)=>{
                console.log(data);
                setUserStatistic(data);
            },
            onError : ()=>{

            }
        })
    },[]);

    return (
        <div className="">
            <div className="w-full mt-5 flex rounded-2xl mb-1 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 gap-5 justify-between items-center">
                  <div className="">
                    <Title order={3}>Current Training</Title>
                    <Text>{trainingData.length}/{userStatistic?.total_users ?? 0} Anda sudah bisa melakukan agregasi model </Text>
                </div>
                <Button disabled={trainingData.length!=userStatistic?.total_users   }>Averaging</Button>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="w-full mt-5  rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 gap-5 justify-between items-center">
                    <Title order={3}>Statistik Training Client</Title>
                    
                    {
                        trainingData[0] ? ( <LineChartOne data={[{
                            series : "str",
                            data : trainingData[0].loss
                        }]}></LineChartOne> )   : (<></>)
                    }
                    
                </div>
                <div className="w-full mt-5  rounded-2xl mb-10 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 gap-5 justify-between items-center">
                    <Title order={3} className="pb-3">Daftar Training User</Title>
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTd>No</TableTd>
                                <TableTd>Name</TableTd>
                                <TableTd>No</TableTd>
                                <TableTd>No</TableTd>
                                <TableTd>Waktu Pelatihan</TableTd>
                            </TableTr>
                        </TableThead>
                        <TableBody>
                            { trainingData.map((data, index)=>{
                                return(
                                    <TableTr key={data.session_id}>
                                        <TableTd>{index+1}</TableTd>
                                        <TableTd>{data.session_id}</TableTd>
                                        <TableTd></TableTd>
                                        <TableTd></TableTd>
                                        <TableTd>{data.created_at}</TableTd>
                                    </TableTr>
                                )
                            })

                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}