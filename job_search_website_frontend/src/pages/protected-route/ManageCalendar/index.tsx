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
  VisibilityState,
} from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { interviewApi, jobApi } from "@/apis"
import Pagination from "@/components/shared/Pagination"
import { Check, Hourglass, Minus, TimerIcon, UserCircle2Icon } from "lucide-react"
// import _ from "lodash"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Layout/Components/Select"
import { Interview } from "@/apis/interview"
import { formatDate } from "@/config"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"

export const ManageCalendar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [checkFiltered, setCheckFiltered] = useState<number | undefined>(undefined)
  const [query, setQuery] = useState<string>("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    education: false, // Đặt `false` để ẩn cột
  })

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

  const { data: getAllInterview, refetch: refetchAllInterview } = useQuery({
    queryKey: ["getAllInterview"],
    queryFn: () => interviewApi.getMyInterview(),
    refetchOnMount: true,
  })
  const employerId = localStorage.getItem("employerId")
  const { data: getAllJobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobApi.getJobByEmployerId(Number(employerId) || 1),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })

  console.log("getAllInterview", getAllInterview)

  const handleComplete = useCallback(
    async (id: string) => {
      const res = await interviewApi.completeInterview(id)
      if (res?.EC === 0) {
        toast.success("Hoàn thành phỏng vấn")
        refetchAllInterview()
      } else {
        toast.error(`${res?.EM}`)
      }
    },
    [refetchAllInterview],
  )
  const handleCancel = useCallback(
    async (id: string) => {
      const res = await interviewApi.cancelInterview(id)
      if (res?.EC === 0) {
        toast.success("Hủy phỏng vấn")
        refetchAllInterview()
      } else {
        toast.error(`${res?.EM}`)
      }
    },
    [refetchAllInterview],
  )

  const columnHelper = createColumnHelper<Interview>()
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
      columnHelper.accessor((row) => `${row.application.resume.employee.fullName}`, {
        id: "fullName",
        header: "Ứng viên",
        filterFn: "includesString",
        size: 340,
        maxSize: 440,
        cell: (info) => (
          <div className="flex cursor-pointer flex-col gap-2">
            <div className="flex items-center gap-2">
              <UserCircle2Icon className="mr-2 h-5 w-5 text-navTitle" />
              <span>{info.getValue()}</span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.date}`, {
        id: "date",
        header: "Thời gian",
        cell: (info) => (
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <TimerIcon className="text-black" size={20} />
              <span>{formatDate(info.getValue())}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hourglass className="text-black" size={20} />
              <span>{info.row.original.time}</span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.application.job.title}`, {
        id: "job",
        header: "Tin tuyển dụng",
        cell: (info) => (
          <div className="flex flex-col justify-center gap-2">
            <span className="text-base text-black">{info.getValue()}</span>
          </div>
        ),
        filterFn: (row, columnId, filterExperience) => {
          const ExperienceRow = row.original.application.job.id
          if (filterExperience == "all") {
            return true
          }
          return filterExperience == ExperienceRow
        },
      }),
      columnHelper.accessor((row) => `${row.status}`, {
        id: "status",
        header: "Trạng thái",
        minSize: 77,
        maxSize: 77,
        cell: (info) => (
          <div className="flex items-center">
            <span
              className={`${info.getValue() === "scheduled" ? "text-orange-500" : info.getValue() === "completed" ? "text-green-500" : "text-red-500"} rounded-full bg-slate-200 px-2 py-1 text-base font-bold`}
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
              onClick={() => handleComplete(info.getValue())}
              size={40}
              className="rounded-full bg-navTitle p-2 text-white transition-all hover:bg-green-700"
            />
            <Minus
              onClick={() => handleCancel(info.getValue())}
              size={40}
              className="rounded-full bg-red-500 p-2 text-white transition-all hover:bg-red-700"
            />
          </div>
        ),
      }),
    ]
    return columns
  }, [columnHelper, handleCancel, handleComplete])

  const finalData = useMemo(() => getAllInterview?.DT || [], [getAllInterview])
  const navigate = useNavigate()
  const tableInstance = useReactTable({
    columns: columnDef,
    data: finalData,
    state: {
      columnFilters,
      columnVisibility,
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
    onColumnVisibilityChange: setColumnVisibility,
  })

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      onFilterSearchChange()
    }
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <div className="flex w-full items-center justify-between">
        <div className="mx-0 w-[450px] rounded-md border-[1px] border-slate-300">
          <input
            className="mr-2 w-full rounded-md border-none bg-white px-3 py-2 text-sm font-normal leading-5 text-black focus:outline-none"
            placeholder="Gõ tên ứng viên vào đây"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            id="search"
          />
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <Label className="text-base font-medium text-black">Danh sách tin tuyển dụng: </Label>
          <Select
            onValueChange={(value: string) => {
              setColumnFilters((prev: any) => {
                const jobSelect = prev.find((filter: any) => filter.id === "job")?.value
                if (!jobSelect) {
                  return prev.concat({
                    id: "job",
                    value: value,
                  })
                } else {
                  return prev.map((f: any) =>
                    f.id === "job"
                      ? {
                          ...f,
                          value: value,
                        }
                      : f,
                  )
                }
              })
              setCheckFiltered(0)
            }}
          >
            <SelectTrigger className="w-[200px] bg-white text-black">
              <SelectValue placeholder="Tin tuyển dụng"></SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem className="text-black" key="all" value="all">
                  All
                </SelectItem>
                {!isLoading &&
                  getAllJobs?.DT.map((i) => (
                    <SelectItem className="text-black" key={i.id} value={i.id.toString()}>
                      {i.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
                          : column.column.columnDef.id == "date"
                            ? "w-[5.938rem] md:w-[10.813rem] lg:w-[18.5rem]"
                            : column.column.columnDef.id == "job"
                              ? "w-[5.938rem] md:w-[10.813rem] lg:w-[18.5rem]"
                              : column.column.columnDef.id == "fullName"
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
                // onClick={() => window.open(`/manage-resume/${row.original.id}`)}
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
          notilength={getAllInterview?.DT.length || 0}
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
