import { spinner } from ".";

interface Flags {
  name: string;
  key: string;
  description: string;
}

export function FlagsSkeleton() {
  return (
    <div className="flex flex-col gap-2 space-y-2 py-4 -mt-2">
      <div className="flex flex-col p-4 bg-zinc-900 rounded-md max-w-96 flex-shrink-0">
        <div className="bg-zinc-500 py-1 w-fit text-transparent text-sm rounded-lg">
          xxxxxxxxxxx
        </div>
        <div className="text-sm py-1 font-bold w-fit bg-zinc-500  text-transparent rounded-lg">
          xxxxxxxxxxxxxxxxxxxxxx
        </div>
        <div className="bg-zinc-500 py-1 text-transparent w-fit text-sm rounded-lg">
          xxxxxxxxxxxxxxxxxxxxxxx
        </div>
      </div>
    </div>
  );
}
