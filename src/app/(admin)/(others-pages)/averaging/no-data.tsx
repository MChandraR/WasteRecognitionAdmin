import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import { TbMoodEmpty } from "react-icons/tb";

export default function NoData() {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center  sm:max-w-[472px]">

       {/* <Image
          src="/images/error/404.svg"
          alt="404"
          className="dark:hidden"
          width={472}
          height={152}
        /> */}
        <div className="flex align-middle justify-center">
          <TbMoodEmpty width={300} size={300} height={300} className="h-20 w-20 self-center "/>
        </div>


        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Tidak ada data untuk saat ini !
        </p>

        
      </div>
    
    </div>
  );
}
