export const DATABASES = ["postgres", "mongodb", "cassandra"] as const;

export type Endpoint = (typeof DATABASES)[number];

export type TestResult = {
  times: number[];
  average: number;
  median: number;
};

export type Result = Record<Endpoint, TestResult>;
