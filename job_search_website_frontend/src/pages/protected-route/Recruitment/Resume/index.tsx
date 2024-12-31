/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/shared/Button"
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
import jobs from "@/type/jobs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { jobApi } from "@/apis"
import Pagination from "@/components/shared/Pagination"
import { experience, Industries, jobFields, jobType, professionalPosition, salary } from "@/features/filter/data"
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/shared/dialog"
import { X } from "lucide-react"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Layout/Components/Select"
import FroalaEditorComponent from "@/components/shared/froalaEditorComponent"
import generateFroalaConfig from "@/config/froala.config"
// import _ from "lodash"
import { toast } from "react-toastify"
import { DateTimePicker } from "@/components/Layout/Components/shared/DateTimePicker/date-time-picker"
import { formatDate } from "@/config"
import { useNavigate } from "react-router"

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  description: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  location: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  requirements: z.string().min(1, "Vui lòng điền vào chỗ trống"),
})

type CreateJobsSchema = z.infer<typeof formSchema>

export const RecruitmentTable = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const employerId = localStorage.getItem("employerId")
  const froalaConfig = useMemo(() => generateFroalaConfig(), [])
  const [jobField, setJobField] = useState<string>("")
  const [professionalPositionSelect, setProfessionalPositionSelect] = useState<string>("")
  const [industry, setIndustry] = useState<string>("")
  const [experienceSelect, setExperienceSelect] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [requirements, setRequirements] = useState<string>("")
  const [salarySelect, setSalarySelect] = useState<string>("")
  const [jobTypeSelect, setJobTypeSelect] = useState<string>("")
  const [openDialog, setOpenDialog] = useState(false)
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [checkFiltered, setCheckFiltered] = useState<number | undefined>(undefined)
  const [date, setDate] = useState<Date>(new Date())
  const [query, setQuery] = useState<string>("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (event: any) => {
    setQuery(event.target.value)
  }

  const onFilterSearchChange = useCallback(() => {
    setColumnFilters((prev: any) => {
      const searchQuery = prev.find((filter: any) => filter.id === "title")
      if (!searchQuery) {
        return prev.concat({
          id: "title",
          value: query,
        })
      } else {
        return prev.map((f: any) =>
          f.id === "title"
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

  const { data: getAllJobs, refetch: refetchAllJobs } = useQuery({
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
  console.log("getAllJobs", getAllJobs)

  const columnHelper = createColumnHelper<jobs>()
  const columnDef = useMemo(() => {
    const columns = [
      columnHelper.accessor((row) => `${row.id}`, {
        id: "id",
        header: "Số",
        minSize: 50,
        maxSize: 50,
        cell: (info) => (
          <div className="flex items-center">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.title}`, {
        id: "title",
        header: "Tin tuyển dụng",
        filterFn: "includesString",
        size: 340,
        maxSize: 440,
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <span>{info.getValue()}</span>
            <span
              className={`${info.cell.row.original.jobStatus === "open" ? "bg-navTitle text-white" : "bg-red-600 text-white"} w-fit rounded-full px-2 py-1`}
            >
              {info.cell.row.original.jobStatus === "open" ? "Còn mở" : "Đã đóng"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.industry}`, {
        id: "industry",
        header: "Ngành nghề",
        cell: (info) => (
          <div className="flex items-center">
            <span>
              {Industries.filter((industy) => industy.key === info.getValue()).map((industry) => industry.name)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.professionalPosition}`, {
        id: "professionalPosition",
        header: "Vị trí chuyên môn",
        minSize: 77,
        maxSize: 77,
        cell: (info) => (
          <div className="flex items-center">
            <span>
              {professionalPosition
                .filter((position) => position.key === info.getValue())
                .map((position) => position.name)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.salaryRange}`, {
        id: "salaryRange",
        header: "Mức lương",
        minSize: 80,
        maxSize: 80,
        cell: (info) => (
          <div className="flex items-center">
            <span>{salary.filter((sal) => sal.key === info.getValue()).map((sal) => sal.name)}</span>
          </div>
        ),
      }),
      columnHelper.accessor((row) => `${row.closedDate}`, {
        id: "closedDate",
        header: "Ngày kết thúc",
        minSize: 80,
        maxSize: 80,
        cell: (info) => (
          <div className="flex items-center">
            <span>{formatDate(info.getValue())}</span>
          </div>
        ),
      }),
    ]
    return columns
  }, [columnHelper])

  const finalData = useMemo(() => getAllJobs?.DT || [], [getAllJobs])
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateJobsSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      requirements: "",
    },
  })

  useEffect(() => {
    if (description) {
      setValue("description", description)
    }
    if (requirements) {
      setValue("requirements", requirements)
    }
  }, [description, requirements, setValue])
  // const convertText = (data: Filter[],key: string)=>
  //   {
  //     return data.filter((field)=>field.key === key).map((field)=>field.label)
  //   }

  const RegisterCompany = useMutation({
    mutationFn: jobApi.createJob,
    onSuccess: (Res) => {
      if (Res?.EC === 0) {
        toast.success("Dang ki thành công!")
        refetchAllJobs()
        setOpenDialog(false)
      } else {
        toast.error("Error")
      }
    },
    onError: () => {
      toast.error("Error")
    },
  })

  function onSubmit(values: CreateJobsSchema) {
    console.log("values", values)
    if (!date) {
      toast.error("Vui lòng chọn hạn nộp")
      return
    }
    const data = {
      title: values.title,
      description: description,
      location: values.location,
      salaryRange: salarySelect,
      jobType: jobTypeSelect,
      requirements: requirements,
      industry: industry,
      jobField: jobField,
      professionalPosition: professionalPositionSelect,
      experience: experienceSelect,
      closedDate: date,
    }
    RegisterCompany.mutate(data)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex gap-1">
        <Dialog
          open={openDialog}
          onOpenChange={() => {
            // form.reset()
            setOpenDialog(!openDialog)
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-md bg-navTitle px-3 py-2 font-semibold text-white">Tạo mới</Button>
          </DialogTrigger>
          <DialogContent className="z-50 flex h-full flex-col overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl text-navTitle">Tạo tin tuyển dụng</DialogTitle>
              <DialogClose className="h-fit w-fit bg-navTitle">
                <X className="h-6 w-6" />
              </DialogClose>
            </DialogHeader>
            <form className="mb-8 mt-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 flex flex-col space-y-2 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="title">Tên tuyển dụng</Label>
                  <Input {...register("title")} id="title" type="text" />
                  {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="location">Địa chỉ</Label>
                  <Input id="location" {...register("location")} type="text" />
                  {errors.location && <p className="text-red-500">{errors.location.message}</p>}
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="experience">kinh nghiệm</Label>
                  <Select onValueChange={(value) => setExperienceSelect(value)}>
                    <div className="flex w-full space-x-3">
                      <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                        <SelectValue placeholder="Chọn danh mục">
                          <span className="text-black">
                            {experience.filter((field) => field.key === experienceSelect).map((field) => field.name)}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      {experience.map((i) => (
                        <SelectItem
                          key={i.key}
                          value={i.key}
                          className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                        >
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="experience">Hình thức</Label>
                  <Select onValueChange={(value) => setJobTypeSelect(value)}>
                    <div className="flex w-full space-x-3">
                      <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                        <SelectValue placeholder="Chọn danh mục">
                          <span className="text-black">
                            {jobType.filter((field) => field.key === jobTypeSelect).map((field) => field.name)}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                    </div>

                    <SelectContent>
                      {jobType.map((i) => (
                        <SelectItem
                          className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                          key={i.key}
                          value={i.key}
                        >
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </LabelInputContainer>
                <div className="h-auto">
                  <Label>Mô tả</Label>
                  <FroalaEditorComponent
                    tag="textarea"
                    config={froalaConfig}
                    model={description}
                    onModelChange={(e: string) => setDescription(e)}
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <LabelInputContainer>
                    <Label htmlFor="jobField">Lĩnh vực</Label>
                    <Select onValueChange={(value) => setJobField(value)}>
                      <div className="flex w-full space-x-3">
                        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                          <SelectValue placeholder="Chọn danh mục">
                            <span className="text-black">
                              {jobFields.filter((field) => field.key === jobField).map((field) => field.label)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>

                      <SelectContent>
                        {jobFields.map((i) => (
                          <SelectItem
                            className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                            key={i.key}
                            value={i.key}
                          >
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="industry">Ngành nghề</Label>
                    <Select onValueChange={(value) => setIndustry(value)}>
                      <div className="flex w-full space-x-3">
                        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                          <SelectValue placeholder="Chọn danh mục">
                            <span className="text-black">
                              {Industries.filter((field) => {
                                return field.jobField === jobField && field.key === industry
                              }).map((field) => field.name)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>

                      <SelectContent>
                        {Industries.filter((field) => {
                          return field.jobField === jobField
                        }).map((i) => (
                          <SelectItem
                            className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                            key={i.key}
                            value={i.key}
                          >
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                </div>
                <div className="flex w-full items-center justify-between">
                  <LabelInputContainer>
                    <Label htmlFor="location">Vị trí chuyên môn</Label>
                    <Select onValueChange={(value) => setProfessionalPositionSelect(value)}>
                      <div className="flex w-full space-x-3">
                        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                          <SelectValue placeholder="Chọn danh mục">
                            <span className="text-black">
                              {professionalPosition
                                .filter(
                                  (field) =>
                                    field.key === professionalPositionSelect &&
                                    field.jobField === jobField &&
                                    field.jobs === industry,
                                )
                                .map((field) => field.name)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>

                      <SelectContent>
                        {professionalPosition
                          .filter((field) => field.jobField === jobField && field.jobs === industry)
                          .map((i) => (
                            <SelectItem
                              className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                              key={i.key}
                              value={i.key}
                            >
                              {i.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="location">Mức lương</Label>
                    <Select onValueChange={(value) => setSalarySelect(value)}>
                      <div className="flex w-full space-x-3">
                        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                          <SelectValue placeholder="Chọn danh mục">
                            <span className="text-black">
                              {salary.filter((field) => field.key === salarySelect).map((field) => field.name)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>

                      <SelectContent>
                        {salary.map((i) => (
                          <SelectItem
                            className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                            key={i.key}
                            value={i.key}
                          >
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                </div>
                <div className="h-auto">
                  <Label>Yêu cầu công việc</Label>
                  <FroalaEditorComponent
                    tag="textarea"
                    config={froalaConfig}
                    model={requirements}
                    onModelChange={(e: string) => setRequirements(e)}
                  />
                </div>
                <div className="flex">
                  <DateTimePicker
                    date={date}
                    setDate={(date: Date | undefined) => setDate(date || new Date())}
                    disableBeforeDate={new Date()}
                  />
                </div>
              </div>
              <button
                className="group/btn relative block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Xác nhận &rarr;
                <BottomGradient />
              </button>
            </form>
          </DialogContent>
        </Dialog>
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
          notilength={getAllJobs?.DT.length || 0}
          setCheckFiltered={setCheckFiltered}
          checkFiltered={checkFiltered}
        ></Pagination>
      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}
