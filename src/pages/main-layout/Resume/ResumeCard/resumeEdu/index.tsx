import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/shared/dialog"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { useState } from "react"
import { Edit, Plus } from "lucide-react"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Layout/Components/Select"
import { Button } from "@/components/shared/Button"
import { Resume } from "@/type/resume"
import _ from "lodash"

const degrees = [
  { key: "1", label: "Cao đẳng" },
  { key: "2", label: "Đại học" },
  { key: "3", label: "Thạc sĩ" },
  { key: "4", label: "Tiến sĩ" },
]

export const EduResume = ({
  resumeData,
  setResumeData,
}: {
  resumeData: Resume
  setResumeData: React.Dispatch<React.SetStateAction<Resume>>
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openChild, setOpenChild] = useState(false)
  const [university, setUniversity] = useState<string>("")
  const [degree, setDegree] = useState<string>("")
  const [startYear, setStartYear] = useState<string>("")
  const [endYear, setEndYear] = useState<string>("")
  const [open, setOpen] = useState<number>()
  return (
    <div className="flex h-full w-full flex-col rounded-md bg-white px-6 py-5">
      <div className="flex w-full items-center justify-between">
        <span className="font-base font-semibold text-black">Học vấn</span>
        <Dialog
          open={openDialog}
          onOpenChange={() => {
            setOpenDialog(!openDialog)
          }}
        >
          <DialogTrigger className="border-none bg-transparent p-0">
            <div className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-secondaryColor">
              <Plus className="text-black" size={20} />
            </div>
          </DialogTrigger>
          <DialogContent className="w-80 justify-start px-8">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl text-navTitle">Thông tin học vấn</DialogTitle>
            </DialogHeader>
            <LabelInputContainer>
              <Label htmlFor="university">Tên truong</Label>
              <Input
                id="university"
                placeholder="Tên truong"
                type="text"
                onChange={(e) => setUniversity(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="jobField">Bang cap</Label>
              <Select key={degree} value={degree} onValueChange={(value: string) => setDegree(value)}>
                <div className="flex w-full space-x-3">
                  <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                    <SelectValue placeholder="Chọn danh mục">
                      <span className="text-black">
                        {degrees.filter((field) => field.key === degree).map((field) => field.label)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                </div>

                <SelectContent position="item-aligned" className="bg-white">
                  {degrees.map((i) => (
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
              <Label htmlFor="startYear">Nam bat dau</Label>
              <Input
                id="startYear"
                placeholder="Nam bat dau"
                type="text"
                onChange={(e) => setStartYear(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="endYear">Nam ket thuc</Label>
              <Input id="endYear" placeholder="Nam ket thuc" type="text" onChange={(e) => setEndYear(e.target.value)} />
            </LabelInputContainer>
            <DialogFooter className="flex w-full gap-3 bg-white">
              <Button
                onClick={() => {
                  setUniversity("")
                  setDegree("")
                  setStartYear("")
                  setEndYear("")
                  setOpenDialog(false)
                }}
                className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  setResumeData({
                    ...resumeData,
                    educations: [
                      ...resumeData.educations,
                      {
                        id: resumeData.educations.length + 1,
                        university: university,
                        degree: degree,
                        startYear: Number(startYear),
                        endYear: Number(endYear),
                      },
                    ],
                  })
                  setUniversity("")
                  setDegree("")
                  setStartYear("")
                  setEndYear("")
                  setOpenDialog(false)
                }}
                className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
              >
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-between mt-5 flex w-full flex-wrap gap-6">
        {resumeData.educations.map((edu) => (
          <div className="flex h-fit w-full flex-col border-b-2 bg-white pb-6">
            <div className="flex w-full justify-between py-3 text-lg font-semibold">
              <span className="text-black">{edu.university}</span>
              <Dialog
                open={openChild && open === edu.id}
                onOpenChange={() => {
                  if (!openChild) {
                    console.log("Vaoday")
                    setUniversity(edu.university)
                    setDegree(edu.degree)
                    setStartYear(edu.startYear.toString())
                    setEndYear(edu.endYear.toString())
                  }
                  if (openChild) {
                    setUniversity("")
                    setDegree("")
                    setStartYear("")
                    setEndYear("")
                  }
                  setOpenChild(!openChild)
                }}
              >
                <DialogTrigger onClick={() => setOpen(edu.id)} className="border-none bg-transparent p-0">
                  <div className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-secondaryColor">
                    <Edit className="text-black" size={20} />
                  </div>
                </DialogTrigger>
                <DialogContent className="w-80 justify-start px-8">
                  <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl text-navTitle">Thông tin học vấn</DialogTitle>
                  </DialogHeader>
                  <LabelInputContainer>
                    <Label htmlFor="university">Tên truong</Label>
                    <Input
                      id="university"
                      defaultValue={edu.university}
                      type="text"
                      onChange={(e) => {
                        console.log("updateUni", e.target.value)
                        setUniversity(e.target.value)
                      }}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="jobField">Bang cap</Label>
                    <Select
                      key="child"
                      value={degree}
                      defaultValue={edu.degree}
                      onValueChange={(value: string) => setDegree(value)}
                    >
                      <div className="flex w-full space-x-3">
                        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                          <SelectValue>
                            <span className="text-black">
                              {degrees.filter((field) => field.key === degree).map((field) => field.label)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                      </div>

                      <SelectContent position="item-aligned" className="bg-white">
                        {degrees.map((i) => (
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
                    <Label htmlFor="startYear">Nam bat dau</Label>
                    <Input
                      id="startYear"
                      defaultValue={edu.startYear}
                      placeholder="Nam bat dau"
                      type="text"
                      onChange={(e) => setStartYear(e.target.value)}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="endYear">Nam ket thuc</Label>
                    <Input
                      id="endYear"
                      defaultValue={edu.endYear}
                      placeholder="Nam ket thuc"
                      type="text"
                      onChange={(e) => setEndYear(e.target.value)}
                    />
                  </LabelInputContainer>
                  <DialogFooter className="flex w-full gap-3 bg-white">
                    <Button
                      onClick={() => {
                        setUniversity("")
                        setDegree("")
                        setStartYear("")
                        setEndYear("")
                        setOpenChild(false)
                      }}
                      className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        const updateData = _.cloneDeep(resumeData.educations)
                        updateData
                          .filter((item) => item.id === edu.id)
                          .map((education) => {
                            education.university = university
                            education.degree = degree
                            education.startYear = Number(startYear)
                            education.endYear = Number(endYear)
                          })
                        setResumeData({
                          ...resumeData,
                          educations: updateData,
                        })
                        setUniversity("")
                        setDegree("")
                        setStartYear("")
                        setEndYear("")
                        setOpenChild(false)
                      }}
                      className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
                    >
                      Lưu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm font-light text-black">
              {degrees.find((degree) => degree.key === edu.degree)?.label}
            </div>
            <div className="text-sm font-extralight text-black">
              {edu.startYear} - {edu.endYear}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
