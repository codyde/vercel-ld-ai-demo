"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { ToggleFlag } from "../ldflags";
import { useState } from "react";

export default function FeatureFlag({
  flagKey,
  flagName,
  flagDescription,
  flagStatus,
}: {
  flagKey: string;
  flagName: string;
  flagDescription: string;
  flagStatus: boolean;
}) {
  const [toggleStatus, setToggleStatus] = useState(flagStatus);

  async function ToggleFeatureFlag() {
    console.log("changing");
    let newFlagStatus;
    if (toggleStatus === true) {
      newFlagStatus = "turnFlagOff";
    } else {
      newFlagStatus = "turnFlagOn";
    }
    const change = await ToggleFlag({
      projectKey: "ld-core-demo-rko",
      featureFlagKey: flagKey,
      environment: "codyde",
      flagStatus: newFlagStatus,
    });
    await setToggleStatus(!toggleStatus);
    return change;
  }

  return (
    <Card className="w-full max-w-lg dark mb-2">
      <CardHeader className="flex flex-row items-start p-6 gap-4">
        <div className="flex flex-col items-start gap-1 w-full">
          <Label
            className="text-xs font-medium leading-none text-gray-400 dark:text-gray-300"
            htmlFor="feature-flag-key"
          >
            Feature Flag Key
          </Label>
          <h2 className="text-lg font-bold tracking-tight leading-none text-gray-50 dark:text-gray-200">
            {flagKey}
          </h2>
        </div>
        <div className="flex items-center">
          <Switch
            checked={toggleStatus}
            onCheckedChange={ToggleFeatureFlag}
            id="free-trial-toggle"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start p-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight leading-none text-gray-50 dark:text-gray-200">
          {flagName}
        </h1>
        <p className="text-sm font-medium leading-none text-gray-400 dark:text-gray-300">
          {flagDescription}
        </p>
      </CardContent>
    </Card>
  );
}
