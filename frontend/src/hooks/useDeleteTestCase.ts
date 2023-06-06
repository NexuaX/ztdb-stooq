import axios from "axios";
import { useCallback, useState } from "react";
import { DATABASES, Result } from "./types";
import { round } from "../utils/round";
import { transformResults } from "../utils/transformResults";

export const useDeleteTestCase = () => {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<Result | null>(null);

  const makeApiCall = async (endpoint: string) => {
    const startTime = new Date();
    await axios.delete(`/${endpoint}`);
    const endTime = new Date();

    const duration = endTime.getTime() - startTime.getTime();
    return round(duration);
  };

  const makeDatabaseTest = useCallback(
    async (db: string, endpoints: string[]) => {
      const times = [];

      for (const idx in endpoints) {
        const duration = await makeApiCall(`${db}/${endpoints[idx]}`);
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
    async (urls: string[]) => {
      setLoading(true);

      const r1 = await makeDatabaseTest(DATABASES[0], urls);
      const r2 = await makeDatabaseTest(DATABASES[1], urls);
      const r3 = await makeDatabaseTest(DATABASES[2], urls);

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
