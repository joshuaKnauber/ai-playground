import { PlayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Response } from "./components/Response";
import { RunCard } from "./components/RunCard";
import { Run } from "./types";
import { getResponses } from "./ai";

const DRAFT_RUN: Run = {
  name: "DRAFT RUN",
  prompt: "",
  system: "",
  responses: {},
  timestamp: Date.now(),
};

function App() {
  const [runs, setRuns] = useState<Run[]>(
    localStorage.getItem("runs")
      ? JSON.parse(localStorage.getItem("runs") || "")
      : [],
  );

  const [loading, setLoading] = useState(false);

  const [hoverRun, setHoverRun] = useState<Run | null>(null);
  const [activeRun, setActiveRun] = useState<Run>(
    localStorage.getItem("draft")
      ? JSON.parse(localStorage.getItem("draft") || "")
      : { ...DRAFT_RUN },
  );

  const onRun = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const responses = await getResponses(
        activeRun.prompt,
        activeRun.system || "",
      );
      setActiveRun((r) => ({ ...r, responses }));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const onSave = () => {
    let runName = prompt("Enter a run name", "") || "";
    if (!runName) return;
    setRuns((currRuns) => [
      ...currRuns,
      {
        ...activeRun,
        timestamp: Date.now(),
        name: runName,
      },
    ]);
  };

  const deleteRun = (index: number) => {
    setRuns((currRuns) => [
      ...currRuns.slice(0, index),
      ...currRuns.slice(index + 1),
    ]);
  };

  const onDownload = () => {
    // save as comma separated csv
    const modelCols = Array.from(
      new Set(runs.flatMap((r) => Object.keys(r.responses))),
    );
    const rows = [
      ["Name", "Prompt", "System", "Timestamp", ...modelCols],
      ...runs.map((r) => [
        r.name,
        r.prompt,
        r.system || "",
        r.timestamp,
        ...modelCols.map((model) => `"${r.responses[model] || ""}"`),
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // download file
    const a = document.createElement("a");
    a.href = url;
    a.download = "runs.csv";
    a.click();
    a.remove();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      onRun();
    }
  };

  useEffect(() => {
    localStorage.setItem("runs", JSON.stringify(runs));
  }, [runs]);

  useEffect(() => {
    localStorage.setItem("draft", JSON.stringify(activeRun));
  }, [activeRun]);

  return (
    <div className={`flex h-screen flex-col`}>
      <div className="flex h-full flex-grow flex-row">
        <section className="flex h-full w-[300px] flex-col border-r border-r-black border-opacity-40">
          <div className="flex h-14 w-[300px] items-center justify-between border-b border-black border-opacity-40 px-8">
            <span className="font-bold">Runs</span>
            <button
              className="opacity-75 transition-all hover:opacity-100"
              onClick={onDownload}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {runs.map((run, i) => (
              <RunCard
                key={i}
                run={run}
                onMouseOver={() => setHoverRun(run)}
                onMouseLeave={() => setHoverRun(null)}
                onClick={() => {
                  if (confirm("Discard draft and load this run?")) {
                    setActiveRun(run);
                  } else if (confirm("Delete this run?")) {
                    deleteRun(i);
                  }
                }}
              />
            ))}
            {runs.length === 0 && (
              <span className="block px-8 py-6 text-sm opacity-50">
                No runs saved yet
              </span>
            )}
          </div>
        </section>
        <section className="flex flex-1 flex-col border-r border-r-black border-opacity-40">
          <div className="flex h-14 items-center px-8">
            <span className="font-bold">Prompt</span>
          </div>
          <div className="flex-[0.5] border-b border-b-black border-opacity-40">
            <textarea
              value={(hoverRun || activeRun).system || ""}
              onChange={(e) => {
                setActiveRun((r) => ({ ...r, system: e.target.value }));
              }}
              onKeyDown={onKeyDown}
              className="h-full w-full resize-none px-8 pt-4 text-sm focus:outline-none"
              placeholder="Enter system prompt here..."
            ></textarea>
          </div>
          <div className="flex-1">
            <textarea
              value={(hoverRun || activeRun).prompt}
              onChange={(e) => {
                setActiveRun((r) => ({ ...r, prompt: e.target.value }));
              }}
              onKeyDown={onKeyDown}
              className="h-full w-full resize-none px-8 pt-4 text-sm focus:outline-none"
              placeholder="Enter prompt here..."
            ></textarea>
          </div>
          <div className="flex flex-row items-center justify-end gap-3 px-8 py-4">
            <button
              onClick={onRun}
              className="flex flex-row items-center gap-2 rounded-md bg-black py-2 pl-5 pr-6 text-sm font-medium leading-none text-white disabled:opacity-50"
              disabled={loading}
            >
              <PlayIcon className="h-4 w-4" />
              Run
            </button>
            <button
              onClick={onSave}
              className="rounded-md px-6 py-2 text-sm font-medium leading-none ring-2 ring-inset ring-black"
            >
              Save Run
            </button>
          </div>
        </section>
        <section className="flex h-full flex-1 flex-col">
          <div className="flex h-14 items-center px-8">
            <span className="font-bold">Responses</span>
          </div>
          <div className="flex-1 overflow-auto">
            {Object.keys((hoverRun || activeRun).responses).map((model, i) => (
              <Response
                key={i}
                model={model}
                text={(hoverRun || activeRun).responses[model].text}
                time={(hoverRun || activeRun).responses[model].time}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
