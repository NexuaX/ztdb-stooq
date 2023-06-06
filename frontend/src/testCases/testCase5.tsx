import { useForm } from "react-hook-form";
import { XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";
import { format, sub } from "date-fns";
import { DATABASES } from "../hooks/types";
import { usePostTestCase } from "../hooks/usePostTestCase";
import { Spinner } from "../components/spinner";
import { Table } from "../components/table";
import { capitalise } from "../utils/capitalise";

export type FormData = {
  name: string;
  queriesNumber: number;
  date: string;
};

export const TestCase5 = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const { loading, trigger, result, transformedResults } = usePostTestCase();

  const handler = handleSubmit((data) => {
    trigger(`${data.name}/update`, Number(data.queriesNumber), () => ({
      date: data.date,
      volume: Math.round(Math.random() * 10000),
    }));
  });

  return (
    <div>
      <h1>Test case 5 - Update wartości pola</h1>

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
          <label>Data: </label>
          <input
            type="date"
            {...register("date")}
            defaultValue={format(
              sub(new Date(), { years: 3, days: 4 }),
              "yyyy-MM-dd"
            )}
          />
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
