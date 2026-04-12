"use client";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useState, useEffect } from "react";
import UserService from "@/service/UserService";
import TrainingSessionService from "@/service/TrainingSessionService";
import TotalTrainingCount from "@/models/domain/TotalTrainingCount";
import { UserStatisticResponse } from "@/models/APIResponse/UserStatisticResponse";


export const EcommerceMetrics = () => {
  const [userCount, setUsercount] = useState("0");
  const [totalTrainingSessionCount, setTotalTrainingSessionCount] = useState<TotalTrainingCount>()

  useEffect(() => {
    UserService.getUserStatistics({
      onSuccess: (data : UserStatisticResponse) => {
        setUsercount(data.total_users.toLocaleString());
      },
      onError: (error:string) => {
        console.error("Failed to fetch user statistics:", error);
      },
    });

    TrainingSessionService.getTotalTrainingSessionCount()
      ?.then( (data) => {
          setTotalTrainingSessionCount(data)
      })
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jumlah Client
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Training Session
            </span>
            <div className="w-max mt-2 flex justify-between gap-x-6 font-bold text-gray-800 text-2xl">
              <a>Pending : {totalTrainingSessionCount?.total_pending}</a>
              <a>Trained : {totalTrainingSessionCount?.total_trained}</a>
            </div>
          </div>

      
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
