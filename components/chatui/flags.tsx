
interface Flags {
  name: string;
  key: string;
  description: string;
}

export function Flags({ flags }: { flags: Flags[] }) {
  return (
    <div className="flex flex-col gap-2 py-4 -mt-2">
      {flags.map(flag => (
        <div
          key={flag.key}
          className="flex flex-col p-4 bg-zinc-900 rounded-md max-w-96 flex-shrink-0"
        >
          <div className="text-zinc-400 text-sm">
            {flag.key}
          </div>
          <div className="text-base font-bold text-zinc-200">
            {flag.name}
          </div>
          <div className="text-zinc-500">
            {flag.description}...
          </div>
        </div>
      ))}
    </div>
  );
}
