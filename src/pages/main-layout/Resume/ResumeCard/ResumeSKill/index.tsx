import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/shared/dialog"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Button } from "@/components/shared/Button"
import { Resume } from "@/type/resume"
// import _ from "lodash"
import { MultiSelect } from "react-multi-select-component"
import { useQuery } from "@tanstack/react-query"
import { resumeApi } from "@/apis"
import { useAuth } from "@/hooks/useAuth"
interface Skill {
  id: number
  value: number
  label: string
}

export const SkillResume = ({
  resumeData,
  setResumeData,
}: {
  resumeData: Resume
  setResumeData: React.Dispatch<React.SetStateAction<Resume>>
}) => {
  const { isLoggedIn } = useAuth()
  const [openDialog, setOpenDialog] = useState(false)
  // const [openChild, setOpenChild] = useState(false)
  const [skill, setSkill] = useState<Skill[]>()

  const getAllSkill = useQuery({
    queryKey: ["getSkill"],
    queryFn: resumeApi.getAllSKill,
    enabled: isLoggedIn,
  })

  useEffect(() => {
    if (getAllSkill.data) {
      setSkill(
        (resumeData.resumeSkills ?? []).map((item) => {
          const skillName = getAllSkill.data?.DT.find((skill) => skill.id === item)?.label ?? ""
          return { label: skillName, value: item, id: item }
        }),
      )
    }
  }, [getAllSkill.data, resumeData.resumeSkills])

  console.log("resumeData", resumeData)

  function findSkillName(id: number) {
    return getAllSkill.data?.DT.find((item) => item.id === id)?.label
  }

  return (
    <div className="flex h-full w-full flex-col rounded-md bg-white px-6 py-5">
      <div className="flex w-full items-center justify-between">
        <span className="font-base font-semibold text-black">Kỹ năng</span>
        <Dialog
          open={openDialog && !getAllSkill.isLoading}
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
              <DialogTitle className="text-2xl text-navTitle">Danh sách kỹ năng</DialogTitle>
            </DialogHeader>
            <LabelInputContainer>
              <Label htmlFor="university">Skills: </Label>
              <MultiSelect
                options={getAllSkill.data?.DT || []}
                value={skill || []}
                onChange={setSkill}
                labelledBy="Chọn kỹ năng"
                className="z-50 w-full text-base text-black"
              />
            </LabelInputContainer>
            <DialogFooter className="flex w-full gap-3 bg-white">
              <Button
                onClick={() => {
                  setSkill([])
                  setOpenDialog(false)
                }}
                className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  const skillData = (skill ?? []).map((item) => item.value)
                  setResumeData({
                    ...resumeData,
                    resumeSkills: skillData,
                  })
                  setSkill([])
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
      <div className="space-between mt-5 flex w-full flex-col gap-6">
        {resumeData.resumeSkills.map((skill) => (
          <span className="text-base font-normal text-black">- {findSkillName(skill)}</span>
        ))}
      </div>
    </div>
  )
}
