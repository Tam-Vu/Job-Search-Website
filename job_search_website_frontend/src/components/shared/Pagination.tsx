import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"

import { IoChevronForwardOutline } from "react-icons/io5"
import { IoChevronBackOutline } from "react-icons/io5"
import { Table } from "@tanstack/react-table"
import jobs from "@/type/jobs"
import { getApplicationAcceptedByJobIdRes, getApplicationByJob } from "@/apis/applicationsApi"
import { Interview } from "@/apis/interview"

interface PaginationType {
  itemsPerPage: number
  setItemOffset?: (offset: number) => void | undefined
  notilength: number
  table?:
    | Table<jobs>
    | Table<getApplicationByJob>
    | Table<getApplicationAcceptedByJobIdRes>
    | Table<Interview>
    | undefined
  setPreviousPage?: (offset: number) => void
  checkFiltered?: number | undefined
  setCheckFiltered?: (offset: number | undefined) => void
}

function Pagination({
  itemsPerPage,
  setItemOffset,
  notilength,
  table,
  setPreviousPage,
  checkFiltered,
  setCheckFiltered,
}: PaginationType) {
  const [forcePage, setForcePage] = useState<number | undefined>(checkFiltered)
  const pageCount = Math.ceil(notilength / itemsPerPage)

  const handlePageClick = (event: { selected: number }) => {
    if (table) {
      table.setPageIndex(event.selected)
      if (setPreviousPage) {
        setPreviousPage(event.selected)
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (setItemOffset) {
      const newOffset = (event.selected * itemsPerPage) % notilength
      setItemOffset(newOffset)

      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    if (setCheckFiltered) setCheckFiltered(undefined)
  }
  useEffect(() => {
    setForcePage(checkFiltered)
  }, [checkFiltered])
  return (
    <div>
      <ReactPaginate
        forcePage={forcePage}
        previousLabel={
          <div className="flex items-center justify-center px-4 py-[0.625rem] hover:bg-slate-100 focus:bg-slate-100">
            <IoChevronBackOutline className="mr-[0.625rem] text-black" />
            <span className="text-sm text-black">Previous</span>
          </div>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        breakLabel="..."
        pageCount={pageCount}
        nextLabel={
          <div className="flex items-center justify-center px-4 py-[0.625rem] hover:bg-slate-100 focus:bg-slate-100">
            <span className="mr-[0.625rem] text-sm text-black">Next</span>
            <IoChevronForwardOutline className="text-black" />
          </div>
        }
        renderOnZeroPageCount={null}
        breakClassName="flex w-7 block decoration-0 h-[2.5rem] w-[2.5rem] mr-1 list-none items-center text-black justify-center rounded-md bg-white text-sm hover:bg-slate-100"
        pageLinkClassName="flex w-7 block decoration-0 h-[2.5rem] w-[2.5rem] mr-1 list-none items-center text-black justify-center rounded-md bg-white text-sm hover:bg-slate-100"
        containerClassName="items-center flex justify-center mb-3"
        activeLinkClassName="border-2 border-slate-200 decoration-0 list-none"
      />
    </div>
  )
}

export default Pagination
