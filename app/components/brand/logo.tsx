import { Fragment } from "react/jsx-runtime";

interface LogoProps {
  square?: boolean;
}

export function Logo({ square }: LogoProps) {
  return (
    <Fragment>
      <span className="bg-primary text-primary-foreground inline-block rounded p-1">
        RM
      </span>
      {!square && <span className="inline-block rounded">XYZ</span>}
    </Fragment>
  );
}
