import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";

export default function DateTimeInput({
  className,
  defaultValue,
  disabled,
  readOnly,
  ...props
}: React.ComponentProps<"input">) {
  const [open, setOpen] = useState(false);
  const parseDefaultValue = (
    val?: string | number | readonly string[],
  ): Date | undefined => {
    if (!val) return undefined;
    const raw = Array.isArray(val) ? val[0] : val;
    if (typeof raw === "string" || typeof raw === "number") {
      const parsed = new Date(raw);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  };

  const initialDate = parseDefaultValue(defaultValue);
  const initialTime = initialDate ? format(initialDate, "HH:mm:ss") : "";

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [time, setTime] = useState<string>(initialTime);

  const getCombinedDate = (d?: Date, t?: string): Date | undefined => {
    if (!d) return undefined;
    const resultDate = new Date(d);
    if (t) {
      const [hours, minutes, seconds] = t.split(":").map(Number);
      if (!isNaN(hours)) resultDate.setHours(hours);
      if (!isNaN(minutes)) resultDate.setMinutes(minutes);
      if (!isNaN(seconds)) resultDate.setSeconds(seconds || 0);
    }
    return resultDate;
  };

  const combinedDate = getCombinedDate(date, time);
  const value = combinedDate ? combinedDate.toISOString() : "";

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
  };

  const isInteractive = !disabled && !readOnly;

  return (
    <div className="flex gap-2">
      <Popover open={open && isInteractive} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground shink justify-start text-left font-normal",
              className,
            )}
          >
            {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            required
            selected={date}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        step={1}
        value={time}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleTimeChange}
        className={cn(
          "bg-background w-36 grow appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
          className,
        )}
      />
      <input
        type="hidden"
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    </div>
  );
}
