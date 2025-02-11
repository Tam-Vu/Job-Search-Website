/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader } from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Input as DateInput } from "@/components/shared/Input"
import { dateToString, formatTime } from "@/config"
import { interviewApi } from "@/apis"
import { toast } from "react-toastify"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
export const CreateInterview = ({
  id,
  openDialog,
  setOpenDialog,
}: {
  id: number
  openDialog: boolean
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  const [location, setLocation] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const handleLocation = (event: any) => {
    setLocation(event.target.value)
  }
  const handleSubmit = async () => {
    const data = {
      location,
      date: dateToString(date),
      time: formatTime(date),
    }
    console.log("CreateINTER", data)
    const res = await interviewApi.createInterview(data, Number(id))
    if (res?.EC === 0) {
      toast.success("Tạo phỏng vấn thành công")
      queryClient.invalidateQueries({ queryKey: ["acceptedApplication"] })
      setOpenDialog(false)
    } else {
      toast.error("Tạo phỏng vấn thất bại")
      toast.error(`${res?.EM}`)
    }
  }
  return (
    <Dialog
      key={id}
      open={openDialog}
      onOpenChange={() => {
        // form.reset()
        console.log("checkId", openDialog)
        setOpenDialog(!openDialog)
      }}
    >
      <DialogContent className="z-50 flex h-fit w-[500px] flex-col overflow-y-auto">
        <DialogHeader className="text-lg font-semibold text-black">Tạo phỏng vấn</DialogHeader>
        <LabelInputContainer>
          <Label className="text-black">Địa điểm</Label>
          <Input
            type="text"
            className="h-10 w-full rounded-md border-[1px] border-slate-300 bg-black px-3 py-2 text-base text-white focus:outline-none"
            value={location}
            placeholder="Nhập địa chỉ"
            onChange={handleLocation}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label className="text-black">Ngày phỏng vấn</Label>
          <DateInput
            type="datetime-local"
            className="h-10 w-fit rounded-md border-[1px] border-slate-300 bg-black px-3 py-2 text-base text-white focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </LabelInputContainer>
        <Button onClick={handleSubmit}>Cập nhật</Button>
      </DialogContent>
    </Dialog>
  )
}
