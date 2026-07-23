import { useMemo, useState, useEffect, useRef } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { formatDateTime, parseDateTime } from "~/lib/utils";

export default function InputDateTime({
  value: valueProp,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  placeholder,
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = valueProp !== undefined;

  const [internalDate, setInternalDate] = useState<Date | undefined>(() =>
    parseDateTime(isControlled ? valueProp : defaultValue),
  );

  const [textValue, setTextValue] = useState<string>(() => {
    if (isControlled) {
      return valueProp !== undefined ? String(valueProp) : "";
    }
    if (defaultValue !== undefined) {
      const parsed = parseDateTime(defaultValue);
      return parsed ? formatDateTime(parsed) : String(defaultValue);
    }
    return "";
  });

  useEffect(() => {
    if (isControlled) {
      const parsed = parseDateTime(valueProp);
      setInternalDate(parsed);
      setTextValue(valueProp !== undefined ? String(valueProp) : "");
    }
  }, [valueProp, isControlled]);

  const currentDate = internalDate;

  const timeData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const val = i.toString().padStart(2, "0");
      return { label: val, value: val };
    });
    const minutes = Array.from({ length: 60 }, (_, i) => {
      const val = i.toString().padStart(2, "0");
      return { label: val, value: val };
    });
    const seconds = Array.from({ length: 60 }, (_, i) => {
      const val = i.toString().padStart(2, "0");
      return { label: val, value: val };
    });
    return { hours, minutes, seconds };
  }, []);

  const currentHourStr = currentDate
    ? currentDate.getHours().toString().padStart(2, "0")
    : "00";
  const currentMinuteStr = currentDate
    ? currentDate.getMinutes().toString().padStart(2, "0")
    : "00";
  const currentSecondStr = currentDate
    ? currentDate.getSeconds().toString().padStart(2, "0")
    : "00";

  const triggerInputChange = (newFormattedStr: string, newDate?: Date) => {
    if (!isControlled) {
      setInternalDate(newDate);
      setTextValue(newFormattedStr);
    }

    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, newFormattedStr);

      const event = new Event("change", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextValue(val);
    const parsed = parseDateTime(val);
    setInternalDate(parsed);
    onChange?.(e);
  };

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
      setInternalDate(undefined);
      triggerInputChange("", undefined);
      return;
    }

    const newDate = new Date(selectedDay);
    if (currentDate) {
      newDate.setHours(
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
      );
    } else {
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }

    const formatted = formatDateTime(newDate);
    setInternalDate(newDate);
    triggerInputChange(formatted, newDate);
  };

  const handleTimeChange = (
    type: "hours" | "minutes" | "seconds",
    val: string,
  ) => {
    const num = parseInt(val, 10);
    const baseDate = currentDate ? new Date(currentDate) : new Date();

    if (type === "hours") baseDate.setHours(num);
    if (type === "minutes") baseDate.setMinutes(num);
    if (type === "seconds") baseDate.setSeconds(num);

    const formatted = formatDateTime(baseDate);
    setInternalDate(baseDate);
    triggerInputChange(formatted, baseDate);
  };

  const handleSetNow = () => {
    const now = new Date();
    const formatted = formatDateTime(now);
    setInternalDate(now);
    triggerInputChange(formatted, now);
  };

  const handleClear = () => {
    setInternalDate(undefined);
    triggerInputChange("", undefined);
  };

  const isInteractive = !disabled && !readOnly;

  return (
    <InputGroup className={className}>
      <InputGroupInput
        ref={inputRef}
        value={textValue}
        onChange={handleInputChange}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open && isInteractive} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              size="icon-sm"
              disabled={!isInteractive}
              aria-label="Pick date and time"
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-3">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              className="p-0"
            />
            <Separator className="my-2" />
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-center text-[10px] font-medium uppercase">
                    Hour
                  </span>
                  <Select
                    value={currentHourStr}
                    onValueChange={(val) => handleTimeChange("hours", val)}
                    disabled={!isInteractive}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 min-w-[4rem]">
                      {timeData.hours.map((hour) => (
                        <SelectItem value={hour.value} key={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-center text-[10px] font-medium uppercase">
                    Minute
                  </span>
                  <Select
                    value={currentMinuteStr}
                    onValueChange={(val) => handleTimeChange("minutes", val)}
                    disabled={!isInteractive}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 min-w-[4rem]">
                      {timeData.minutes.map((min) => (
                        <SelectItem value={min.value} key={min.value}>
                          {min.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-center text-[10px] font-medium uppercase">
                    Second
                  </span>
                  <Select
                    value={currentSecondStr}
                    onValueChange={(val) => handleTimeChange("seconds", val)}
                    disabled={!isInteractive}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue placeholder="SS" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 min-w-[4rem]">
                      {timeData.seconds.map((sec) => (
                        <SelectItem value={sec.value} key={sec.value}>
                          {sec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 flex-1 text-xs"
                  onClick={handleSetNow}
                >
                  Now
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="h-7 flex-1 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
