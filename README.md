# Vercel AI SDK 3.0 Demo with LaunchDarkly

This demo uses the Vercel AI SDK to call the LaunchDarkly API for basic tasks. UI components are streamed back to the user and updated as the data becomes available. 

Today, the following tasks are supported: 

- Create projects and return the default SDK keys 
- Get all flags in a project / environment 
- Toggle individual flags (both conversationally and via the card UIs)
- Get metrics for an environment 

This was more created as a learning exercise, if you want to dig into the code base, the important bits are as follows - 

- `app/actions.tsx` - Holds all the query data items, OpenAI function calls, the streaming UI functionality, and ultimately the "OnFunction" actions. The flow is User Conversation -> OpenAI function call -> OnFunction Action -> Your in App functions
- `utils/index.tsx` - This was the Vercel written code for calling the OpenAI sdks, and all the logic surrounding the SDK interaction 

## Setup Instructions 

Running this is straight forward, create a `.env.local` file and add the following parameters to it

```
OPENAI_API_KEY=
LD_API_KEY=api-
NEXT_PUBLIC_LD_API_KEY=
```

OpenAI API key is your OpenAI access key. The LD API key is your LD API key for the account you'd use to query. 

Go forth and build! 