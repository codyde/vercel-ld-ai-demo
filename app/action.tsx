import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import {
  spinner,
  BotCard,
  BotMessage
} from "@/components/chatui";

import {
  runAsyncFnWithoutBlocking,
  sleep,
  formatNumber,
  runOpenAICompletion,
} from "@/lib/utils";
import { z } from "zod";
import { CreateProject, GetAllFlags, GetMetrics, ToggleFlag } from "@/components/ldflags";
import { Flags } from "@/components/chatui/flags";
import { FlagsSkeleton } from "@/components/chatui/flags-skeleton";
import FeatureFlag from "@/components/chatui/featureflag";
import FeatureFlagSkeleton from "@/components/chatui/featureflag-skeleton";
import Metric from "@/components/chatui/metrics";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const zOpenAIQueryResponse = z.object({
  projectKey: z.string().describe(`
    Creates a projectKey for a LaunchDarkly Project.

    Project Keys are always lowercase and instead of spaces use hyphens. An example of this might be 'LD Core Demo RKO' becoming 'ld-core-demo-rko'. 
    
    Any entry that fits this format should be queried. Other examples might be project-1, rko-project-4, demo-account-11, etc...

    It is case sensitive, and absolutely should be entirely lowercase. 
    `),
  environment: z.string().describe(`Creates an environment within a LaunchDarkly project. 
  
  Examples of this might be 'production', 'staging', 'development', 'qa', but other options should be able to be used as well, such as [all]. 
  
  it is case sensitive and absolutely should be entirely lowercase. This is a key.`)
});

type OpenAIQueryResponse = z.infer<typeof zOpenAIQueryResponse>;

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const completion = runOpenAICompletion(openai, {
    model: "gpt-4-turbo-preview",
    stream: true,
    messages: [
      {
        role: "system",
        content: `\
You are an AI assistant focusing on the LaunchDarkly feature flags. 

Your job is to query the LaunchDarkly API with specific parapeters to return information and make configuration changes. You expect specific properties such as [project key, feature flag, environment, experiment] or other attributes to passed in as parameters. 

You can only execute functions when you have the required parameters present that can be provided.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
- "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.
- "[projectKey = ld-core-demo-rko]" means that the projectKey parameter is ld-core-demo-rko

If the user asks to create a new project in LaunchDarkly, call the \`create_project\` function and use the project name and the project key as parameters for the call. Pass both of these parameters into the create_project function call. If no project key is provided, you should suggest using the lowercase version of the project name with hyphens in place of spaces as the project key. Give the user a choice between using this or entering a new project key. 

If the user asks to see the feature flags in place, call \`get_flags\` and use the project key and environemnt key reference as parameters for the call. Pass only both of these parameters into the get_flags function call.

If a user asks to either [enable, disable, or toggle a feature or feature flag], call \`toggle_flag\` and use the project key, feature flag key, environment, and flag status as parameters for the call. Pass all these parameters into the toggle_flag function call.

If a user asks to get the existing metrics in an environment, call the \`get_metrics\` function and use the project keyfor the call. Pass only this parameter into the get_metrics function call.

If you are missing the required parameter, you can ask the user for it. Offer to use previously referenced items if possible.

Besides that, you can also chat with users and do some calculations if needed.`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: "create_project",
        description: "Create a new project in LaunchDarkly using the project name and the project key",
        parameters: z.object({
          projectName: z.string().describe(`Creates a project name for a LaunchDarkly Project.`),
          projectKey: z.string().describe(`
          Creates a projectKey for a LaunchDarkly Project.

          Project Keys are always lowercase and instead of spaces use hyphens. An example of this might be 'LD Core Demo RKO' becoming 'ld-core-demo-rko'. 
          
          Any entry that fits this format should be queried. Other examples might be project-1, rko-project-4, demo-account-11, etc...

          It is case sensitive, and absolutely should be entirely lowercase.
          
          If this is not provided, suggest to user to use the project name, but all lowercase, with hypens in place instead of spaces.
          `)
        })
      },
      {
        name: "get_flags",
        description:
          "Get the current feature flags in a launchdarkly project using the project key",
        parameters: zOpenAIQueryResponse,
        // required: ["projectKey"],
      },
      {
        name: "get_metrics",
        description:
          "Get the current feature flags in a launchdarkly project using the project key",
        parameters: zOpenAIQueryResponse,
        // required: ["projectKey"],
      },
      {
        name: "toggle_flag",
        description:
          "Toggle a feature flag in a launchdarkly project using the project key, feature flag key, environment, and flag status",
        parameters: z.object({
          projectKey: z.string()
            .describe(`Project Keys are always lowercase and instead of spaces use hyphens. An example of this might be 'LD Core Demo RKO' becoming 'ld-core-demo-rko'. 
    
          Any entry that fits this format should be queried. Other examples might be project-1, rko-project-4, demo-account-11, etc...
      
          It is case sensitive, and absolutely should be entirely lowercase. Only the Project Key should be returned, no additional data.`),
          featureFlagKey: z
            .string()
            .describe(
              `Feature Flag Keys are always lowercase and instead of spaces use hyphens or no spaces at all. An example of this might be 'New UI Login' becoming 'new-ui-login or newuilogin'`
            ),
          environment: z.string()
            .describe(`Environments in LaunchDarkly align to the environments you might have in your application. Examples might be 'production', 'staging', 'development', 'qa', etc..
          
          They are always lowercase and instead of spaces either use hypens or use no spaces at all. 
          `),
          flagStatus: z
            .string()
            .describe(
              `Flag status will always either be turnFlagOn or turnFlagOff, with case sensitivity. If the user requests to either enable or turn the flag on it the value should be [turnFlagOn], of its disabled or turned off it should be [turnFlagOff].`
            ),
        }),
        required: ["projectKey", "featureFlagKey", "environment", "flagStatus"],
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  //   completion.onFunctionCall("list_stocks", async ({ stocks }) => {
  //     reply.update(
  //       <BotCard>
  //         <StocksSkeleton />
  //       </BotCard>
  //     );

  //     await sleep(1000);

  //     reply.done(
  //       <BotCard>
  //         <Stocks stocks={stocks} />
  //       </BotCard>
  //     );

  //     aiState.done([
  //       ...aiState.get(),
  //       {
  //         role: "function",
  //         name: "list_stocks",
  //         content: JSON.stringify(stocks),
  //       },
  //     ]);
  //   });

  //   completion.onFunctionCall("get_events", async ({ events }) => {
  //     reply.update(
  //       <BotCard>
  //         <EventsSkeleton />
  //       </BotCard>
  //     );

  //     await sleep(1000);

  //     reply.done(
  //       <BotCard>
  //         <Events events={events} />
  //       </BotCard>
  //     );

  //     aiState.done([
  //       ...aiState.get(),
  //       {
  //         role: "function",
  //         name: "list_stocks",
  //         content: JSON.stringify(events),
  //       },
  //     ]);
  //   });

  //   completion.onFunctionCall("get_weather", async ({ weather }) => {
  //     console.log("weather is going");
  //     reply.update(
  //       <BotCard>
  //         <p>{weather}</p>
  //       </BotCard>
  //     );
  //   });

  completion.onFunctionCall("create_project", async (input: any) => {
    const { projectName, projectKey } = input;
    const response = await CreateProject({
      projectName,
      projectKey,
    });

    reply.update(
      <BotCard>
        {spinner}
      </BotCard>
    );

    reply.done(
      <BotCard>
        {JSON.stringify(response)}
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "create_project",
        content: JSON.stringify(response),
      },
    ]);
  })

  completion.onFunctionCall("toggle_flag", async (input: any) => {
    const { projectKey, featureFlagKey, environment, flagStatus } = input;
    const response = await ToggleFlag({
      projectKey,
      featureFlagKey,
      environment,
      flagStatus,
    });

    reply.update(
      <BotCard>
        <FlagsSkeleton />
      </BotCard>
    );

    reply.done(
      <BotCard>
       <FeatureFlag
        flagKey={featureFlagKey}
        flagName={featureFlagKey}
        flagDescription={featureFlagKey}
        flagStatus={flagStatus === "turnFlagOn" ? true : false}
      /> 
      </BotCard>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "toggle_flag",
        content: JSON.stringify(response),
      },
    ]);
  });

  completion.onFunctionCall("get_flags", async (input: OpenAIQueryResponse) => {
    reply.update(
        <BotCard>
          <FeatureFlagSkeleton />
        </BotCard>
      );

      const flags = await GetAllFlags(input);

      console.log(flags)

    reply.done(
      <BotCard>
        {flags.map((flag: any, idx: number) => (
          <FeatureFlag
          key={idx}
            flagKey={flag.key}
            flagName={flag.name}
            flagDescription={flag.description}
            flagStatus={flag.status}
          />
        ))}
      </BotCard>
    );
    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "get_flags",
        content: JSON.stringify(flags),
      },
    ]);
  });

  completion.onFunctionCall("get_metrics", async (input: OpenAIQueryResponse) => {
    reply.update(
        <BotCard>
          <FeatureFlagSkeleton />
        </BotCard>
      );

      const metrics = await GetMetrics(input);

      console.log(metrics)

    reply.done(
      <BotCard>
        {metrics.map((metric: any, idx: number) => (
          <Metric
          key={idx}
            metricKey={metric.key}
            metricName={metric.name}
            metricDescription={metric.description}
          />
        ))}
      </BotCard>
    );
    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "get_metrics",
        content: JSON.stringify(metrics),
      },
    ]);
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
