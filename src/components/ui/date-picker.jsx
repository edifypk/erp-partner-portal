"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { CalendarDays, Calendar as CalendarIcon } from "lucide-react"
import ReactDOM from 'react-dom';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";


export function DatePicker({
  startMonth,
  endMonth,
  className,
  error,
  value,
  onChange = () => { },
  ...props
}) {

  const [date, setDate] = React.useState(value ? new Date(value) : null);

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleSelect = (selectedData) => {
    if (selectedData) {
      setDate(selectedData);
      onChange(selectedData);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          // disabled={props.disabled}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left bg-transparent font-normal px-3",
            !date && "text-muted-foreground text-muted-foreground",
            error && "border-red-500/20",
            className
          )}
        >
          <CalendarDays className="h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          onMonthChange={date => {
            setDate(date);
            onChange(date);
          }}
          {...props}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}