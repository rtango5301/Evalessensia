import { EvaluationHeader } from "@/components/evaluation/EvaluationHeader"
import { MetricCards } from "@/components/evaluation/MetricCards"
import { PerformanceComparison } from "@/components/evaluation/PerformanceComparison"
import { TestCasesTable } from "@/components/evaluation/TestCasesTable"
import {
  mockEvaluationRun,
  generateTestCases,
} from "@/lib/mock-data/evaluation"

interface ResultsPageProps {
  params: Promise<{
    runId: string
  }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { runId } = await params

  // In a real app, fetch data based on runId
  const run = { ...mockEvaluationRun, id: runId }
  const testCases = generateTestCases(150)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="space-y-6">
        <EvaluationHeader run={run} />
        <MetricCards metrics={run.metrics} />
        <PerformanceComparison performance={run.performance} />
        <TestCasesTable testCases={testCases} />
      </div>
    </div>
  )
}
