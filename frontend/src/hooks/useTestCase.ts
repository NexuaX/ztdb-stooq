import axios from "axios";
import { useCallback, useRef, useState } from "react";

const ENDPOINTS = ["postgres", "mongodb", "cassandra"] as const;

type Endpoint = (typeof ENDPOINTS)[number];

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
  const indexName = useRef("");

  const setQueryNumber = (n: number) => (queryNumber.current = n);
  const setIndexName = (name: string) => (indexName.current = name);

  const [result, setResult] = useState<Result | null>(null);

  const makeApiCall = async (endpoint: string) => {
    const startTime = new Date();
    await axios.get(`/${endpoint}`);
    const endTime = new Date();

    const duration = endTime.getTime() - startTime.getTime();
    return duration;
  };

  const makeDatabaseTest = useCallback(
    async (endpoint: string) => {
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

    const r1 = await makeDatabaseTest(
      `${ENDPOINTS[0]}/company/${indexName.current}`
    );
    const r2 = await makeDatabaseTest(
      `${ENDPOINTS[1]}/company/${indexName.current}`
    );
    const r3 = await makeDatabaseTest(
      `${ENDPOINTS[2]}/company/${indexName.current}`
    );

    setResult({
      [ENDPOINTS[1]]: r1,
      [ENDPOINTS[0]]: r2,
      [ENDPOINTS[2]]: r3,
    });

    setLoading(false);
  }, [makeDatabaseTest]);

  return {
    loading,
    result,
    setQueryNumber,
    setIndexName,
    trigger,
  };
};
