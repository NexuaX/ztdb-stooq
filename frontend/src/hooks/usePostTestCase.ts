import axios from "axios";
import { useCallback, useState } from "react";
import { DATABASES, Result } from "./types";
import { round } from "../utils/round";
import { transformResults } from "../utils/transformResults";


export const usePostTestCase = () => {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<Result | null>(null);

  const makeApiCall = async (
    endpoint: string,
    data: Record<string, unknown>
  ) => {
    const startTime = new Date();
    await axios.post(`/${endpoint}`, data);
    const endTime = new Date();

    const duration = endTime.getTime() - startTime.getTime();
    return round(duration);
  };

  const makeDatabaseTest = useCallback(
    async (
      endpoint: string,
      requestsNumber: number,
      getData: (idx: number) => Record<string, unknown>
    ) => {
      const times = [];

      for (let i = 0; i < requestsNumber; i++) {
        const data = getData(i);
        const duration = await makeApiCall(endpoint, data);
        times.push(duration);
      }

      times.sort();
      const half = Math.floor(times.length / 2);
      const median =
        times.length % 2 === 0
          ? times[half]
          : (times[half - 1] + times[half]) / 2;

      return {
        times,
        average: round(
          times.reduce((acc, curr) => acc + curr, 0) / times.length
        ),
        median,
      };
    },
    []
  );

  const trigger = useCallback(
    async (
      url: string,
      requestsNumber: number,
      getData: (idx: number) => Record<string, unknown>
    ) => {
      setLoading(true);

      const r1 = await makeDatabaseTest(
        `${DATABASES[0]}/company/${url}`,
        requestsNumber,
        getData
      );
      const r2 = await makeDatabaseTest(
        `${DATABASES[1]}/company/${url}`,
        requestsNumber,
        getData
      );
      const r3 = await makeDatabaseTest(
        `${DATABASES[2]}/company/${url}`,
        requestsNumber,
        getData
      );

      setResult({
        [DATABASES[1]]: r1,
        [DATABASES[0]]: r2,
        [DATABASES[2]]: r3,
      });

      setLoading(false);
    },
    [makeDatabaseTest]
  );

  return {
    loading,
    result,
    trigger,
    transformedResults: result ? transformResults(result) : [],
  };
};
