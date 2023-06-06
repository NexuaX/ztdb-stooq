import { useForm } from "react-hook-form";
import { XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";
import { DATABASES } from "../hooks/types";
import { usePostTestCase } from "../hooks/usePostTestCase";
import { Spinner } from "../components/spinner";
import { Table } from "../components/table";
import { capitalise } from "../utils/capitalise";

export type FormData = {
  name: string;
  data: string;
};

export const TestCase8 = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const { loading, trigger, result, transformedResults } = usePostTestCase();

  const handler = handleSubmit((data) => {
    const lines = data.data.split("\n");

    const payloads = lines.map((line) => {
      const [day, closing, highest, lowest, opening, volume] = line.split(",");
      return {
        day,
        close: Number(closing),
        high: Number(highest),
        low: Number(lowest),
        open: Number(opening),
        volume: Number(volume),
      };
    });

    trigger(
      `${data.name}/insert`,
      payloads.length,
      (idx: number) => payloads[idx]
    );
  });

  return (
    <div>
      <h1>Test case 8 - Dodanie nowych wartości</h1>

      <form
        onSubmit={handler}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label>Nazwa aktywu: </label>
          <input {...register("name")} defaultValue="amd_us" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Dane w formacie csv: </label>
          <textarea {...register("data")} style={{ minHeight: 150 }} />
        </div>

        <button type="submit" style={{ width: 100 }}>
          Wykonaj
        </button>
      </form>

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
        </>
      )}
    </div>
  );
};
