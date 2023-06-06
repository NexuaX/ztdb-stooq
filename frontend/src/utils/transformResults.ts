import { Result } from "../hooks/types";

export const transformResults = (result: Result) => {
  const dataCass = result.cassandra.times.map((v, idx) => ({
    name: idx,
    cassandra: v,
  }));
  const dataPg = result.postgres.times.map((v) => ({
    postgres: v,
  }));
  const dataMongo = result.mongodb.times.map((v) => ({
    mongodb: v,
  }));

  const res = [];

  for (let i = 0; i < dataCass.length; i++) {
    res.push({
      ...dataCass[i],
      ...dataPg[i],
      ...dataMongo[i],
    });
  }

  return res;
};
