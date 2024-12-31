import { add, format } from "date-fns"
import { vi } from "date-fns/locale/vi"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shared/Button"
import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
// import { TimePicker } from './time-picker'

export function DateTimePicker({
  disableBeforeDate,
  date,
  setDate,
}: {
  /**
   * The date before which all days are disabled.
   */
  disableBeforeDate?: Date
  date?: Date
  setDate: (date: Date | undefined) => void
}) {
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return
    if (!date) {
      setDate(newDay)
      return
    }
    const diff = newDay.getTime() - date.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    const newDateFull = add(date, { days: Math.ceil(diffInDays) })
    setDate(newDateFull)
  }
  console.log("Date", date)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] justify-start text-left font-normal text-black hover:text-black",
            !date && "text-gray-400 hover:text-gray-400",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-black" />
          {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto bg-black p-0"
        side="right"
        align="center"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            console.log("ChonDate", d)
            handleSelect(d)
          }}
          disabled={disableBeforeDate ? { before: disableBeforeDate } : undefined}
        />
        {/* <div className='p-3 border-t border-border'>
          <TimePicker setDate={setDate} date={date} />
        </div> */}
      </PopoverContent>
    </Popover>
  )
}
