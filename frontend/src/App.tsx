import React, { useMemo } from "react";
import { useTestCase } from "./hooks/useTestCase";
import { Form, FormData } from "./components/Form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  Legend,
} from "recharts";

function App() {
  const { result, trigger, loading, setQueryNumber, setIndexName } =
    useTestCase();

  const onSubmit = (data: FormData) => {
    setQueryNumber(data.queriesNumber);
    setIndexName(data.name);

    trigger();
  };

  const transformedResults = useMemo(() => {
    if (!result) return [];
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
  }, [result]);

  const averages = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Postgres", averageTime: result.postgres.averageTime },
      { name: "MongoDB", averageTime: result.mongodb.averageTime },
      { name: "Cassandra", averageTime: result.cassandra.averageTime },
    ];
  }, [result]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>ZTBD project</h1>

      <Form onSubmit={onSubmit} />
      <div
        style={{
          height: 2,
          width: "80%",
          backgroundColor: "black",
          marginTop: 16,
          marginBottom: 16,
        }}
      />
      <div>
        {loading && <p>loading... </p>}

        {result && (
          <>
            <h3>Averages</h3>
            <BarChart
              width={600}
              height={300}
              data={averages}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageTime" fill="#8884d8" />
            </BarChart>

            <h3>Subsequent Calls</h3>

            <LineChart
              width={600}
              height={300}
              data={transformedResults}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="cassandra" stroke="#8884d8" />
              <Line type="monotone" dataKey="postgres" stroke="#2398f1" />
              <Line type="monotone" dataKey="mongodb" stroke="#de1414" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
