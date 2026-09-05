import { 
  NormalizedJudgeVerdict, 
  SupportedLanguage, 
  TestCaseExecutionResult,
  ProblemTestCaseRecord
} from '../../types';

export interface RunnerTestCase {
  id: string;
  input: any[];
  expectedOutput: any;
  isPublic: boolean;
  position: number;
}

export interface RunnerPayload {
  problemId: string;
  language: SupportedLanguage;
  code: string;
  testCases: RunnerTestCase[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface RunnerOutput {
  status: NormalizedJudgeVerdict;
  runtimeMs: number;
  memoryKb: number;
  testResults: TestCaseExecutionResult[];
  stdout?: string;
  stderr?: string;
  errorMessage?: string;
  compileOutput?: string;
}

export interface IExecutionProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  execute(payload: RunnerPayload): Promise<RunnerOutput>;
}
