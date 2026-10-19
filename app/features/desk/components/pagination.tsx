import { useEffect, useState, type ChangeEvent, type FocusEvent } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Slider } from "~/components/ui/slider";

export default function DeskPagination({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ from, to, count, size: 0 });
  const [sliderValue, setSliderValue] = useState([0, 0]);

  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    setState({ from, to: to, count, size: to - from + 1 });
    setSliderValue([from, to]);
    setIsPrevDisabled(from <= 1);
    setIsNextDisabled(to >= count);
  }, [from, to, count]);

  const getPageSize = () => {
    const actualRangeSize = Math.max(1, to - from + 1);
    const paramSize = parseInt(searchParams.get("size") || "0");
    // Jika sedang di ujung akhir data (to >= count) dan ada paramSize sebelumnya yang valid,
    // pertahankan paramSize tersebut agar tidak menyusut.
    if (count > 0 && to >= count && paramSize > 0) {
      return paramSize;
    }
    // Jika bukan di ujung akhir (user bebas ubah rentang via slider/URL/input),
    // ikuti rentang actual (to - from + 1)
    return actualRangeSize;
  };

  const getPrevSearchParams = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    const size = getPageSize();
    const prevTo = Math.max(1, state.from - 1);
    const prevFrom = Math.max(1, prevTo - size + 1);
    newSearchParams.set("from", prevFrom.toString());
    newSearchParams.set("to", prevTo.toString());
    newSearchParams.set("size", size.toString());
    return newSearchParams.toString();
  };
  const getNextSearchParams = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    const size = getPageSize();
    const nextFrom = state.to + 1;
    const desiredNextTo = nextFrom + size - 1;
    const nextTo = count > 0 ? Math.min(desiredNextTo, count) : desiredNextTo;
    newSearchParams.set("from", nextFrom.toString());
    newSearchParams.set("to", nextTo.toString());
    newSearchParams.set("size", size.toString());
    return newSearchParams.toString();
  };

  const onOpenComplete = (open: boolean) => {
    if (!open) {
      const newFrom = sliderValue[0];
      const newTo = sliderValue[1];
      const newSize = Math.max(1, newTo - newFrom + 1);
      if (newFrom === from && newTo === to) {
        return;
      }
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("from", newFrom.toString());
      newSearchParams.set("to", newTo.toString());
      newSearchParams.set("size", newSize.toString()); // <-- update size di sini
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Popover onOpenChangeComplete={onOpenComplete}>
        <PopoverTrigger
          render={
            <Button variant="ghost">
              {sliderValue[0]}-{sliderValue[1]}/{count}
            </Button>
          }
        />
        <PopoverContent>
          <Slider
            id="slider-demo-temperature"
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value as number[])}
            min={1}
            max={count}
            step={1}
          />
        </PopoverContent>
      </Popover>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to={{ search: getPrevSearchParams() }}
              disabled={isPrevDisabled}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              to={{ search: getNextSearchParams() }}
              disabled={isNextDisabled}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
