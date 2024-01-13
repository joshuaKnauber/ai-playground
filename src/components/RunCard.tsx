import { Run } from "../types";

type RunCardProps = {
  run: Run;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
};

export function RunCard({
  run,
  onClick,
  onMouseLeave,
  onMouseOver,
}: RunCardProps) {
  return (
    <div
      className="flex cursor-pointer flex-col gap-2 border-b border-t border-black border-opacity-10 px-8 py-4 transition-all hover:bg-neutral-200"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <span className="text-sm font-medium leading-tight">{run.name}</span>
      <span className="text-sm leading-tight opacity-50">
        {new Date(run.timestamp).toLocaleString()}
      </span>
    </div>
  );
}
