import axios from "axios";
import { useCallback, useRef, useState } from "react";

const ENDPOINTS = ["cassandra", "postgres", "mongodb"] as const;

type Endpoint = typeof ENDPOINTS[number];

type TestResult = {
  times: number[];
  averageTime: number;
};

type Result = Record<Endpoint, TestResult>;

const INITIAL_VALUE: Result = {
  cassandra: {
    times: [],
    averageTime: 0,
  },
  postgres: {
    times: [],
    averageTime: 0,
  },
  mongodb: {
    times: [],
    averageTime: 0,
  },
};

export const useTestCase = () => {
  const [loading, setLoading] = useState(false);
  const queryNumber = useRef(0);

  const setQueryNumber = (n: number) => (queryNumber.current = n);

  const [result, setResult] = useState<Result | null>(null);

  const makeApiCall = async (endpoint: Endpoint) => {
    const result = await axios.get<{ executionTime: number }>(`/${endpoint}`);

    return result.data.executionTime;
  };

  const makeDatabaseTest = useCallback(
    async (endpoint: Endpoint) => {
      const arr = Array.from({ length: queryNumber.current }, () => 0);

      const times = await Promise.all(
        arr.map(async () => await makeApiCall(endpoint))
      );

      return {
        times,
        averageTime: times.reduce((acc, curr) => acc + curr, 0) / times.length,
      };
    },
    [queryNumber]
  );

  const trigger = useCallback(async () => {
    setLoading(true);

    const results = await Promise.all(
      ENDPOINTS.map(async (endpoint) => await makeDatabaseTest(endpoint))
    );

    setResult({
      [ENDPOINTS[0]]: results[0],
      [ENDPOINTS[1]]: results[1],
      [ENDPOINTS[2]]: results[2],
    });

    setLoading(false);
  }, [makeDatabaseTest]);

  return {
    loading,
    result,
    setQueryNumber,
    trigger,
  };
};
