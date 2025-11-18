import { clsx } from "clsx";

export default function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange(v: boolean): void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-5 w-9 transition-all duration-200 ease-in-out",
        checked ? "bg-rose-700" : "bg-gray-300"
      )}
      aria-pressed={checked}
    >
      <span
        className={clsx(
          "absolute top-[3px] h-[14px] w-[14px] bg-white transition-all duration-200 ease-in-out",
          checked ? "right-[2px]" : "left-[2px]"
        )}
      />
    </button>
  );
}
