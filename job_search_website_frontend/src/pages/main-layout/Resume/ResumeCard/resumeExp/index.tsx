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
import { Button } from "@/components/shared/Button"
import { Resume } from "@/type/resume"
import _ from "lodash"

export const ExpResume = ({
  resumeData,
  setResumeData,
}: {
  resumeData: Resume
  setResumeData: React.Dispatch<React.SetStateAction<Resume>>
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openChild, setOpenChild] = useState(false)
  const [companyName, setCompanyName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [startYear, setStartYear] = useState<string>("")
  const [endYear, setEndYear] = useState<string>("")
  const [startMonth, setStartMonth] = useState<string>("")
  const [endMonth, setEndMonth] = useState<string>("")
  const [open, setOpen] = useState<number>()
  return (
    <div className="flex h-full w-full flex-col rounded-md bg-white px-6 py-5">
      <div className="flex w-full items-center justify-between">
        <span className="font-base font-semibold text-black">Kinh nghiệm</span>
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
          <DialogContent className="w-96 justify-start px-8">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl text-navTitle">Thông tin kinh nghiệm</DialogTitle>
            </DialogHeader>
            <LabelInputContainer>
              <Label htmlFor="companyName">Tên công ty</Label>
              <Input
                id="companyName"
                placeholder="Tên công ty"
                type="text"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="description">Mo ta viec lam</Label>
              <Input
                id="description"
                placeholder="Mo ta viec lam"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
            </LabelInputContainer>
            <div className="flex w-full items-center justify-between gap-3">
              <LabelInputContainer>
                <Label htmlFor="startMonth">Thang bat dau</Label>
                <Input
                  id="startMonth"
                  placeholder="Thang bat dau"
                  type="text"
                  onChange={(e) => setStartMonth(e.target.value)}
                />
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
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <LabelInputContainer>
                <Label htmlFor="endMonth">Thang ket thuc</Label>
                <Input
                  id="endMonth"
                  placeholder="Thang ket thuc"
                  type="text"
                  onChange={(e) => setEndMonth(e.target.value)}
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="endYear">Nam ket thuc</Label>
                <Input
                  id="endYear"
                  placeholder="Nam ket thuc"
                  type="text"
                  onChange={(e) => setEndYear(e.target.value)}
                />
              </LabelInputContainer>
            </div>
            <DialogFooter className="flex w-full gap-3 bg-white">
              <Button
                onClick={() => {
                  setCompanyName("")
                  setDescription("")
                  setStartMonth("")
                  setEndMonth("")
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
                    experienceDetails: [
                      ...resumeData.experienceDetails,
                      {
                        id: resumeData.educations.length + 1,
                        companyName: companyName,
                        description: description,
                        startYear: Number(startYear),
                        endYear: Number(endYear),
                        startMonth: Number(startMonth),
                        endMonth: Number(startYear),
                      },
                    ],
                  })
                  setCompanyName("")
                  setDescription("")
                  setStartMonth("")
                  setEndMonth("")
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
        {resumeData.experienceDetails.map((exp) => (
          <div key={exp.id} className="flex h-fit w-full flex-col border-b-2 bg-white pb-6">
            <div className="flex w-full justify-between py-3 text-lg font-semibold">
              <span className="text-black">{exp.description}</span>
              <Dialog
                key={exp.id}
                open={openChild && exp.id === open}
                onOpenChange={() => {
                  if (!openChild) {
                    console.log("Vaoday", exp.companyName)
                    setCompanyName(exp.companyName)
                    setDescription(exp.description)
                    setStartYear(exp.startYear.toString())
                    setEndYear(exp.endYear.toString())
                    setStartMonth(exp.startMonth.toString())
                    setEndMonth(exp.endMonth.toString())
                  }
                  if (openChild) {
                    setCompanyName("")
                    setDescription("")
                    setStartMonth("")
                    setEndMonth("")
                    setStartYear("")
                    setEndYear("")
                  }
                  setOpenChild(!openChild)
                }}
              >
                <DialogTrigger onClick={() => setOpen(exp.id)} className="border-none bg-transparent p-0">
                  <div className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-secondaryColor">
                    <Edit className="text-black" size={20} />
                  </div>
                </DialogTrigger>
                <DialogContent className="w-80 justify-start px-8">
                  <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl text-navTitle">Thông tin học vấn</DialogTitle>
                  </DialogHeader>
                  <LabelInputContainer>
                    <Label htmlFor="companyName">Tên cong ty</Label>
                    <Input
                      id="companyName"
                      defaultValue={exp.companyName}
                      type="text"
                      onChange={(e) => {
                        console.log("updateUni", e.target.value)
                        setCompanyName(e.target.value)
                      }}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="description">Mo ta viec lam</Label>
                    <Input
                      id="description"
                      defaultValue={exp.description}
                      type="text"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </LabelInputContainer>
                  <div className="flex w-full items-center justify-between gap-3">
                    <LabelInputContainer>
                      <Label htmlFor="startMonth">Thang bat dau</Label>
                      <Input
                        id="startMonth"
                        value={exp.startMonth}
                        type="text"
                        onChange={(e) => setStartMonth(e.target.value)}
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="startYear">Nam bat dau</Label>
                      <Input
                        id="startYear"
                        value={exp.startYear}
                        type="text"
                        onChange={(e) => setStartYear(e.target.value)}
                      />
                    </LabelInputContainer>
                  </div>
                  <div className="flex w-full items-center justify-between gap-3">
                    <LabelInputContainer>
                      <Label htmlFor="endMonth">Thang ket thuc</Label>
                      <Input
                        id="endMonth"
                        value={exp.endMonth}
                        type="text"
                        onChange={(e) => setEndMonth(e.target.value)}
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="endYear">Nam ket thuc</Label>
                      <Input
                        id="endYear"
                        value={exp.endYear}
                        type="text"
                        onChange={(e) => setEndYear(e.target.value)}
                      />
                    </LabelInputContainer>
                  </div>
                  <DialogFooter className="flex w-full gap-3 bg-white">
                    <Button
                      onClick={() => {
                        setCompanyName("")
                        setDescription("")
                        setStartMonth("")
                        setEndMonth("")
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
                        const updateData = _.cloneDeep(resumeData.experienceDetails)
                        updateData
                          .filter((item) => item.id === exp.id)
                          .map((experience) => {
                            experience.companyName = companyName
                            experience.description = description
                            experience.startYear = Number(startYear)
                            experience.endYear = Number(endYear)
                            experience.startMonth = Number(startMonth)
                            experience.endMonth = Number(endMonth)
                          })
                        setResumeData({
                          ...resumeData,
                          experienceDetails: updateData,
                        })
                        setCompanyName("")
                        setDescription("")
                        setStartMonth("")
                        setEndMonth("")
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
            <div className="text-sm font-light text-black">{exp.companyName}</div>
            <div className="text-sm font-extralight text-black">
              {exp.startMonth}th {exp.startYear} - {exp.endMonth}th {exp.endYear}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
