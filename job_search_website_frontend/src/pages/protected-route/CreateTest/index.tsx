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
import Pagination from "@/components/shared/Pagination"
import { Button } from "@/components/shared/Button"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { FormElementInstance } from "@/type/designer"
import CreateTest from "../Interview/CreateTest"
import FormSubmitComponent from "@/components/FormBuilder/FormSubmitComponent"
import createTestApi, { TestDetail } from "@/apis/createTest"
import { formatDate } from "@/config"
import { SendTest } from "./SendTest"

export const ManageTest = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [checkFiltered, setCheckFiltered] = useState<number | undefined>(undefined)
  const [query, setQuery] = useState<string>("")
  const [checkId, setCheckId] = useState<number | undefined>(undefined)
  const getAllCreatedTest = useQuery({
    queryKey: ["createdTest"],
    queryFn: () => createTestApi.getMyTestAsEmployer(),
    refetchOnMount: true,
  })
  console.log("getAllCreatedTest", getAllCreatedTest.data?.DT)
  const [openCreateTest, setOpenCreateTest] = useState(false)
  const [openTest, setOpenTest] = useState(false)
  const [formContent, setFormContent] = useState<FormElementInstance[]>([])
  const [openSendTest, setOpenSendTest] = useState(false)
  const [skipStep, setSkipStep] = useState(false)

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

  const columnHelper = createColumnHelper<TestDetail>()
  const columnDef = useMemo(() => {
    const columns = [
      columnHelper.accessor((row) => `${row.id}`, {
        id: "id",
        header: "STT",
        minSize: 50,
        maxSize: 50,
        cell: (info) => (
          <div className="flex items-center">
            <span>{info.row.index + 1}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.title}`, {
        id: "title",
        header: "Bài kiểm tra",
        filterFn: "includesString",
        size: 340,
        maxSize: 440,
      }),
      columnHelper.accessor((row) => `${row.description}`, {
        id: "description",
        header: "Mô tả",
      }),
      columnHelper.accessor((row) => `${row.createdAt}`, {
        id: "createdAt",
        header: "Ngày tạo",
        minSize: 77,
        maxSize: 77,
        cell: (info) => (
          <div className="flex items-center">
            <span>{formatDate(info.getValue())}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.questions}`, {
        id: "questions",
        header: "Số lượng câu",
        minSize: 77,
        maxSize: 77,
        cell: (info) => (
          <div className="flex items-center">
            <span className="text-base font-medium text-black">{(info.row.original.questions ?? []).length}</span>
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
            <Button
              onClick={() => {
                setCheckId(Number(info.getValue()))
                setOpenTest(true)
              }}
              className="rounded-md bg-navTitle px-3 py-2 font-semibold text-white"
            >
              Xem
            </Button>
            <Button
              onClick={() => {
                setCheckId(Number(info.getValue()))
                setOpenCreateTest(true)
                setSkipStep(true)
              }}
              className="rounded-md bg-orange-500 px-3 py-2 font-semibold text-white"
            >
              Thêm câu hỏi
            </Button>
            <Button
              onClick={() => {
                setCheckId(Number(info.getValue()))
                setOpenSendTest(true)
              }}
              className="rounded-md bg-sky-500 text-white hover:bg-sky-600"
            >
              Gửi
            </Button>
          </div>
        ),
      }),
    ]
    return columns
  }, [columnHelper])

  const finalData = useMemo(() => getAllCreatedTest?.data?.DT || [], [getAllCreatedTest])
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
    <div className="flex h-full min-h-screen w-full flex-col">
      {openCreateTest && (
        <CreateTest
          skipStep={skipStep}
          id={checkId}
          openCreateTest={openCreateTest}
          setOpenCreateTest={setOpenCreateTest}
          setContent={setFormContent}
        />
      )}
      {openTest && (
        <FormSubmitComponent
          id={checkId ?? 0}
          content={formContent}
          setFormContent={setFormContent}
          onclose={() => setOpenTest(false)}
        />
      )}
      {openSendTest && <SendTest id={checkId ?? 0} onClose={() => setOpenSendTest(false)} />}
      <div className="flex items-center justify-between">
        <div className="mb-2 flex w-full flex-col gap-2">
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setCheckId(undefined)
                setOpenCreateTest(true)
                setSkipStep(false)
              }}
              className="rounded-md bg-navTitle px-3 py-2 font-semibold text-white"
            >
              Tạo mới
            </Button>
            <div className="mx-0 w-[450px] rounded-md border-[1px] border-slate-300">
              <input
                className="mr-2 w-full rounded-md border-none bg-white px-3 py-2 text-sm font-normal leading-5 text-black focus:outline-none"
                placeholder="Gõ tên bài kiểm tra vào đây"
                value={query}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                id="search"
              />
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <Label className="text-base font-medium text-black">Danh sách bài kiểm tra: </Label>
          </div>
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
                        column.column.columnDef.id == "questions"
                          ? "w-[4.375rem] md:w-[6.875rem] lg:w-auto"
                          : column.column.columnDef.id == "title"
                            ? "w-[4.375rem] md:w-[6.875rem] lg:w-[12rem]"
                            : column.column.columnDef.id == "createdAt"
                              ? "w-[5.938rem] md:w-[10.813rem] lg:w-[18.5rem]"
                              : column.column.columnDef.id == "description"
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
          notilength={getAllCreatedTest?.data?.DT.length || 0}
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
