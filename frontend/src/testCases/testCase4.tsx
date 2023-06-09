import { useForm } from "react-hook-form";
import { useGetTestCase } from "../hooks/useGetTestCase";
import { XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";
import { DATABASES } from "../hooks/types";
import { Spinner } from "../components/spinner";
import { Table } from "../components/table";
import { capitalise } from "../utils/capitalise";

export type FormData = {
  name: string;
  queriesNumber: number;
};

export const TestCase4 = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const { loading, trigger, result, rawData, transformedResults } =
    useGetTestCase();

  const handler = handleSubmit((data) => {
    trigger(`${data.name}/avg`, Number(data.queriesNumber));
  });

  return (
    <div>
      <h1>Test case 4 - Obliczenia średnich</h1>

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

            <h3>Raw data</h3>
            <div>
              <pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
