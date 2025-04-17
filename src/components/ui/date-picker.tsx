import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label: string
}

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-12 w-full justify-start rounded-full border-white/20 bg-white/10 px-6 text-white backdrop-blur-md hover:bg-white/20 hover:text-white",
            !date && "text-white/50"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="bg-transparent"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-white",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-white/50 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/10 [&:has([aria-selected])]:bg-white/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal text-white",
              "hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white"
            ),
            day_range_end: "day-range-end",
            day_selected: "bg-teal-400 text-black hover:bg-teal-400 hover:text-black focus:bg-teal-400 focus:text-black",
            day_today: "bg-white/10 text-white",
            day_outside: "text-white/30 opacity-50",
            day_disabled: "text-white/20",
            day_hidden: "invisible"
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 