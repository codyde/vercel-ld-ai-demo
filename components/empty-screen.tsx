import { Button } from '@/components/ui/button';
import { ExternalLink } from '@/components/external-link';
import { IconArrowRight } from '@/components/ui/icons';
import { GetAllFlags } from './ldflags';
import React from 'react';

const exampleMessages = [
  {
    heading: 'Get Flags in a Project',
    message: 'I need to get the feature flags in a project',
  },
  {
    heading: "Enable a Feature Flag ",
    message: "I want to enable a feature flag in a specific project and environment",
  },
  {
    heading: "Disable a Feature Flag ",
    message: "I want to disable a feature flag in a specific project and environment",
  },
  {
    heading: "Tell me about a feature flag",
    message: "Tell me about a feature flag",
  }
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  // const [flags, setFlags] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const fetchFlags = async () => {
  //     const allFlags = await GetAllFlags();
  //     setFlags(JSON.stringify(allFlags));
  //   };

  //   fetchFlags();
  // }, []);

  // const flags = GetAllFlags();
    return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg font-semibold">
         Welcome to the LaunchDarkly Generative UI demo 
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This demo combines the new Vercel AI features for Generative UI with the LaunchDarkly API to do cool and interesting things. 

          You can make some queries (not all), and return data back conversationally with the API
        </p>
        
        <p className="leading-normal text-muted-foreground">Try an example:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
