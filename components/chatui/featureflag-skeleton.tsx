import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CardHeader, CardContent, Card } from "@/components/ui/card"

export default function FeatureFlagSkeleton() {
  return (
    <Card className="w-full max-w-lg dark">
      <CardHeader className="flex flex-row items-start p-6 gap-4">
        <div className="flex flex-col items-start gap-1 w-full">
          <Label
            className="text-sm font-medium leading-none text-gray-400 dark:text-gray-300"
            htmlFor="feature-flag-key"
          >
            Feature Flag Key
          </Label>
          <h2 className="text-lg font-bold tracking-tight w-fit leading-none bg-gray-700 roundex-xl text-transparent">
            xxxxxxxxxxxx
          </h2>
        </div>
        <div className="flex items-center">
          <Switch id="free-trial-toggle" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start p-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight w-fit leading-none bg-gray-700 roundex-xl text-transparent">
          xxxxxxxxxxxxxxxxxxxxxxxx
        </h1>
        <p className="text-sm font-medium w-fit leading-none bg-gray-700 roundex-xl text-transparent">
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </p>
      </CardContent>
    </Card>
  )
}

