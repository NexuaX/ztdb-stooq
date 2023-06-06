import { useForm } from "react-hook-form";
import { XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts";
import { eachDayOfInterval, format, sub } from "date-fns";
import { DATABASES } from "../hooks/types";
import { useDeleteTestCase } from "../hooks/useDeleteTestCase";
import { Spinner } from "../components/spinner";
import { Table } from "../components/table";
import { capitalise } from "../utils/capitalise";

export type FormData = {
  name: string;
  startDate: string;
  endDate: string;
};

export const TestCase6 = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const { loading, trigger, result, transformedResults } = useDeleteTestCase();

  const handler = handleSubmit((data) => {
    const interval = eachDayOfInterval({
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    });

    const urls = interval.map(
      (date) => `company/${data.name}?date=${format(date, "yyyy-MM-dd")}`
    );

    trigger(urls);
  });

  return (
    <div>
      <h1>Test case 6 - Usuwanie wartości z przedziału</h1>

      <form
        onSubmit={handler}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label>Nazwa aktywu: </label>
          <input {...register("name")} defaultValue="amd_us" />
        </div>

        <div>
          <label>Początkowa data: </label>
          <input
            type="date"
            {...register("startDate")}
            defaultValue={format(
              sub(new Date(), { years: 1, days: 10 }),
              "yyyy-MM-dd"
            )}
          />
        </div>

        <div>
          <label>Końcowa data: </label>
          <input
            type="date"
            {...register("endDate")}
            defaultValue={format(sub(new Date(), { years: 1 }), "yyyy-MM-dd")}
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
