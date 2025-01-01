/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  createColumnHelper,
  useReactTable,
  getSortedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { applicationApi } from "@/apis"
import Pagination from "@/components/shared/Pagination"
import { Check, Mail, Minus, School } from "lucide-react"
// import _ from "lodash"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router"
import { getApplicationByJob } from "@/apis/applicationsApi"
import { BsSuitcase } from "react-icons/bs"

export const RecruitmentTable = () => {
  const { recruitId } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [checkFiltered, setCheckFiltered] = useState<number | undefined>(undefined)
  const [query, setQuery] = useState<string>("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (event: any) => {
    setQuery(event.target.value)
  }

  const onFilterSearchChange = useCallback(() => {
    setColumnFilters((prev: any) => {
      const searchQuery = prev.find((filter: any) => filter.id === "fullName")
      if (!searchQuery) {
        return prev.concat({
          id: "fullName",
          value: query,
        })
      } else {
        return prev.map((f: any) =>
          f.id === "fullName"
            ? {
                ...f,
                value: query,
              }
            : f,
        )
      }
    })
    setCheckFiltered(0)
  }, [query])

  useEffect(() => {
    if (query == "") {
      onFilterSearchChange()
    }
  }, [onFilterSearchChange, query])

  const { data: getAllCV, refetch: refetchAllCV } = useQuery({
    queryKey: ["CV", recruitId],
    queryFn: () => applicationApi.getApplicationByJobId(Number(recruitId)),
    refetchOnMount: true,
  })
  console.log("getAllCV", getAllCV)

  const columnHelper = createColumnHelper<getApplicationByJob>()
  const columnDef = useMemo(() => {
    const columns = [
      columnHelper.accessor((row) => `${row.id}`, {
        id: "id",
        header: "STT",
        minSize: 50,
        maxSize: 50,
        cell: (info) => (
          <div className="flex items-center">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.resume.employee.fullName}`, {
        id: "fullName",
        header: "Ứng viên",
        filterFn: "includesString",
        size: 340,
        maxSize: 440,
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <span>{info.getValue()}</span>
            <div className="flex items-center gap-2">
              <Mail className="mr-2 h-5 w-5 text-navTitle" />
              <span>{info.row.original.resume.employee.user.email}</span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.resume.name}`, {
        id: "experience",
        header: "Trình độ chuyên môn",
        cell: (info) => (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-black">Kinh nghiệm</span>
            {info.row.original.resume.experienceDetails.length > 0 &&
              info.row.original.resume.experienceDetails.slice(0, 2).map((experience) => (
                <div className="flex items-center gap-2">
                  <BsSuitcase className="text-black" size={20} />
                  <span>{experience.companyName}</span>
                </div>
              ))}
            {info.row.original.resume.experienceDetails.length > 2 && (
              <span className="font-semibold text-black">...</span>
            )}
            <span className="mt-2 font-semibold text-black">Học vấn</span>
            {info.row.original.resume.educations.length > 0 &&
              info.row.original.resume.educations.slice(0, 2).map((experience) => (
                <div className="flex items-center gap-2">
                  <School className="text-black" size={20} />
                  <span>
                    {experience.university} - {experience.degree}
                  </span>
                </div>
              ))}
            {info.row.original.resume.educations.length > 2 && <span className="font-semibold text-black">...</span>}
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.status}`, {
        id: "status",
        header: "Trạng thái",
        minSize: 77,
        maxSize: 77,
        cell: (info) => (
          <div className="flex items-center">
            <span
              className={`${info.getValue() === "pending"} ? "text-yellow-500" : "text-green-500" rounded-full bg-slate-400 px-2 py-1`}
            >
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.id}`, {
        id: "actions",
        header: "Thao tác",
        minSize: 80,
        maxSize: 80,
        cell: (info) => (
          <div className="flex items-center gap-4">
            <Check
              onClick={async () => {
                const res = await applicationApi.approveApplication(Number(info.getValue()))
                if (res?.EC === 0) {
                  toast.success("Duyệt thành công")
                  refetchAllCV()
                }
              }}
              size={20}
              className="rounded-full bg-navTitle p-2 text-white transition-all hover:bg-green-700"
            />
            <Minus
              onClick={async () => {
                const res = await applicationApi.rejectApplication(Number(info.getValue()))
                if (res?.EC === 0) {
                  toast.success("Duyệt thành công")
                  refetchAllCV()
                }
              }}
              size={20}
              className="rounded-full bg-red-500 p-2 text-white transition-all hover:bg-red-700"
            />
          </div>
        ),
      }),
    ]
    return columns
  }, [columnHelper, refetchAllCV])

  const finalData = useMemo(() => getAllCV?.DT || [], [getAllCV])
  const navigate = useNavigate()
  const tableInstance = useReactTable({
    columns: columnDef,
    data: finalData,
    state: {
      columnFilters,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
    columnResizeMode: "onChange",
  })

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      onFilterSearchChange()
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex gap-1">
        <div className="mx-0 w-full rounded-md border-[1px] border-slate-300 lg:mx-6">
          <input
            className="mr-2 w-full rounded-md border-none bg-white px-3 py-2 text-sm font-normal leading-5 text-black focus:outline-none"
            placeholder="Gõ tên chiến dịch vào đây"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            id="search"
          />
        </div>
      </div>
      <table className="font-Manrope mb-4 h-fit w-full border-collapse overflow-x-auto bg-white">
        <thead>
          {tableInstance.getHeaderGroups().map((header) => {
            return (
              <tr className="sticky z-10 h-fit" key={header.id}>
                {header.headers.map((column) => {
                  return (
                    <th
                      className={`${
                        column.column.columnDef.id == "id"
                          ? "w-[4.375rem] md:w-[6.875rem] lg:w-auto"
                          : column.column.columnDef.id == "industry"
                            ? "w-[5.938rem] md:w-[10.813rem] lg:w-[18.5rem]"
                            : column.column.columnDef.id == "professionalPosition"
                              ? "w-[5.938rem] md:w-[10.813rem] lg:w-[18.5rem]"
                              : column.column.columnDef.id == "title"
                                ? "w-auto lg:w-[27.5rem]"
                                : "w-[4.813rem] md:w-[6.5rem] lg:w-[12rem]"
                      } sticky top-0 border-2 bg-sky-600 p-4 px-1 text-left text-[0.5rem] font-bold leading-6 text-white md:top-0 md:px-4 md:text-sm`}
                      key={column.id}
                      colSpan={column.colSpan}
                    >
                      {flexRender(column.column.columnDef.header, column.getContext())}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="table-row cursor-pointer"
                onClick={() => navigate(`manage-recruitment/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      className="border-2 p-4 px-1 text-[0.5rem] font-normal leading-6 text-slate-900 md:px-4 md:text-sm"
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="w-full justify-center">
        <Pagination
          itemsPerPage={10}
          table={tableInstance}
          notilength={getAllCV?.DT.length || 0}
          setCheckFiltered={setCheckFiltered}
          checkFiltered={checkFiltered}
        ></Pagination>
      </div>
    </div>
  )
}

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
//       <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
//     </>
//   )
// }
