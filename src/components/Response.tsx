type ResponseProps = {
  model: string;
  text: string;
  time: number;
};

export function Response({ model, text, time }: ResponseProps) {
  return (
    <div className="flex flex-col gap-2 px-8 py-4">
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-bold leading-tight">{model}</span>
        <span className="whitespace-pre-wrap rounded-md bg-neutral-200 px-1.5 py-0.5 text-xs opacity-75">
          {time / 1000}s
        </span>
      </div>
      <span className="whitespace-pre-wrap text-sm">{text}</span>
    </div>
  );
}
