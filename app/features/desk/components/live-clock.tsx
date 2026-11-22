import { useEffect, useState } from "react";

type DeskLiveClockProps = {
  tz?: string;
};

type ClockTime = {
  hour: string;
  minute: string;
  second: string;
  dayPeriod?: string;
};

export function DeskLiveClock(props: DeskLiveClockProps) {
  const [time, setTime] = useState<ClockTime>({
    hour: "00",
    minute: "00",
    second: "00",
  });
  useEffect(() => {
    const formater = new Intl.DateTimeFormat("id-ID", {
      timeZone: props.tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const update = () => {
      const parts = formater.formatToParts(new Date());
      const result = Object.fromEntries(
        parts.map(({ type, value }) => [type, value]),
      );
      setTime({
        hour: result.hour,
        minute: result.minute,
        second: result.second,
        dayPeriod: result.dayPeriod,
      });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [props.tz]);
  return (
    <div className="flex items-center gap-1 tabular-nums">
      <span className="w-6 text-center font-bold">{time.hour}</span>
      <span>:</span>
      <span className="w-6 text-center font-bold">{time.minute}</span>
      <span>:</span>
      <span className="w-6 text-center">{time.second}</span>
      {time.dayPeriod && (
        <span className="w-8 text-left text-sm">{time.dayPeriod}</span>
      )}
    </div>
  );
}
