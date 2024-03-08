interface Flag {
  name: string;
  key: string;
  description: string;
  environments: any;
}

export async function GetAllFlags({
  projectKey,
  environment,
}: {
  projectKey: string;
  environment: string;
}) {
  console.log(projectKey);
  console.log(environment);
  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}?env=${environment}`,
    {
      method: "GET",
      headers: {
        Authorization: process.env.LD_API_KEY!,
      },
    }
  );

  const data = await resp.json();
  const flags = data["items"];

  // console.log(flags[0]['environments']['codyde']['on'])
  // console.log(flags[0]['environments'][environment]['on'])
  const newFlags = flags.map((flag: Flag) => ({
    name: flag.name,
    key: flag.key,
    status: flag.environments[environment].on,
    description: flag.description,
  }));

  // console.log(newFlags);
  return newFlags;
}

export async function ToggleFlag({
  projectKey,
  featureFlagKey,
  environment,
  flagStatus,
}: {
  projectKey: string;
  featureFlagKey: string;
  environment: string;
  flagStatus: string;
}) {
  console.log(
    projectKey + " " + featureFlagKey + " " + environment + " " + flagStatus
  );

  console.log(process.env.LD_API_KEY!);

  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json; domain-model=launchdarkly.semanticpatch",
        Authorization: process.env.NEXT_PUBLIC_LD_API_KEY!,
      },
      body: JSON.stringify({
        environmentKey: `${environment}`,
        instructions: [{ kind: `${flagStatus}` }],
      }),
    }
  );

  const data = await resp.json();
  console.log(data);
  return data;
}

export async function GetMetrics({ projectKey }: { projectKey: string }) {
  const resp = await fetch(
    `https://app.launchdarkly.com/api/v2/metrics/${projectKey}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.LD_API_KEY!,
      },
    }
  );

  const data = await resp.json();
  const metrics = data["items"];

  const newMetrics = metrics.map((metric: Flag) => ({
    name: metric.name,
    key: metric.key,
    description: metric.description,
  }));

  // console.log(newFlags);
  return newMetrics;
}

export async function CreateProject({projectName, projectKey}: {projectKey: string, projectName: string}) {
  const resp = await fetch(`https://app.launchdarkly.com/api/v2/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.LD_API_KEY!,
    },
    body: JSON.stringify({
      key: `${projectKey}`,
      name: `${projectName}`
    })
  });

  const data = await resp.json();
const environments = data['environments']

  const APIKeys = environments.map((environment: any) => ({
    name: environment.name,
    clientkey: environment._id,
    serverkey: environment.apiKey,
  }))

  return APIKeys
}
