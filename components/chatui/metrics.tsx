import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CardHeader, CardContent, Card } from "@/components/ui/card"

export default function Metric({metricKey, metricName, metricDescription}:{metricKey: string, metricName: string, metricDescription: string}) {
  return (
    <Card className="dark mb-2">
      <CardHeader className="flex flex-row items-start p-6 gap-4">
        <div className="flex flex-col items-start gap-1 w-full">
          <Label
            className="text-xs font-medium leading-none text-gray-400 dark:text-gray-300"
            htmlFor="feature-flag-key"
          >
           Metric Key 
          </Label>
          <h2 className="text-lg font-bold tracking-tight leading-none text-gray-50 dark:text-gray-200">
            {metricKey}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start p-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight leading-none text-gray-50 dark:text-gray-200">
          {metricName}
        </h1>
        <p className="text-sm font-medium leading-none text-gray-400 dark:text-gray-300">
          {metricDescription}
        </p>
      </CardContent>
    </Card>
  )
}

