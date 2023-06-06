import { useForm } from "react-hook-form";
import { useGetTestCase } from "../hooks/useGetTestCase";
import { XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";
import { DATABASES } from "../hooks/types";
import { Spinner } from "../components/spinner";
import { Table } from "../components/table";
import { capitalise } from "../utils/capitalise";
import ReactApexChart from "react-apexcharts";

export type FormData = {
  name: string;
  queriesNumber: number;
  limit?: number;
};

export const TestCase3 = () => {
  const { register, handleSubmit, getValues } = useForm<FormData>();

  const { loading, trigger, result, rawData, transformedResults } =
    useGetTestCase();

  const handler = handleSubmit((data) => {
    trigger(
      `${data.name}/sorted?limit=${data.limit ? Number(data.limit) : 100}`,
      Number(data.queriesNumber)
    );
  });

  return (
    <div>
      <h1>Test case 3 - Select na danych wraz z sortowaniem</h1>

      <form
        onSubmit={handler}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label>Nazwa aktywu: </label>
          <input {...register("name")} defaultValue="amd_us" />
        </div>

        <div>
          <label>Liczba zapytań do wykonania: </label>
          <input
            type="number"
            {...register("queriesNumber")}
            defaultValue={10}
          />
        </div>

        <div>
          <label>Ilość rekordów: </label>
          <input type="number" {...register("limit")} defaultValue={100} />
        </div>

        <button type="submit" style={{ width: 100 }}>
          Wykonaj
        </button>

        {loading && <Spinner />}

        {result && !loading && (
          <>
            <h3>Statystyki czasów wykonań</h3>
            <Table>
              <thead>
                <tr>
                  <th>System Bazodanowy</th>
                  <th>Średni czas zapytania [ms]</th>
                  <th>Mediana czasów zapytania [ms]</th>
                </tr>
              </thead>
              <tbody>
                {DATABASES.map((db) => (
                  <tr>
                    <td>{capitalise(db)}</td>
                    <td>{result[db].average}</td>
                    <td>{result[db].median}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h3>Wykres czasów zapytań</h3>
            <LineChart
              width={635}
              height={350}
              data={transformedResults}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="cassandra" stroke="#009879" />
              <Line type="monotone" dataKey="postgres" stroke="#2398f1" />
              <Line type="monotone" dataKey="mongodb" stroke="#de1414" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Numer żądania",
                  position: "insideBottomRight",
                  offset: -15,
                }}
              />
              <YAxis
                label={{
                  value: "Czas wykonania [ms]",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
            </LineChart>

            <h3>Zwrócone dane</h3>
            {rawData && (
              <ReactApexChart
                type="candlestick"
                height={350}
                options={{
                  chart: {
                    id: "tickerChart",
                    type: "candlestick" as const,
                    height: 350,
                  },
                  title: {
                    text: `Notowania dla ${getValues("name") ?? ""}`,
                    align: "left" as const,
                  },
                  xaxis: {
                    type: "datetime" as const,
                  },
                }}
                series={[
                  {
                    data: rawData.map((ticker) => ({
                      x: ticker.day,
                      y: [
                        ticker.opening,
                        ticker.highest,
                        ticker.lowest,
                        ticker.closing,
                      ],
                    })),
                  },
                ]}
              />
            )}
          </>
        )}
      </form>
    </div>
  );
};
