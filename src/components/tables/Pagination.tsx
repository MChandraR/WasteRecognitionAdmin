import { Pagination , Text} from "@mantine/core";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalData : number;
  onPageChange: (page: number) => void;
};

const TablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalData,
  onPageChange,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(currentPage - 1, 1)
  );

  return (
     <div className="flex justify-between mt-5" >
      <div> 
        <Text>Total Data : {totalData}</Text>
      </div>
      <Pagination value={currentPage} onChange={(index: number) => onPageChange(index)} total={totalPages} color="indigo" />
    </div>
  );
};

export default TablePagination;
