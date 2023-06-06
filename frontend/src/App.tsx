import { useState } from "react";
import { TestCase1 } from "./testCases/testCase1";
import { TestCase2 } from "./testCases/testCase2";
import { TestCase3 } from "./testCases/testCase3";
import { TestCase4 } from "./testCases/testCase4";
import { TestCase5 } from "./testCases/testCase5";
import { TestCase6 } from "./testCases/testCase6";
import { TestCase7 } from "./testCases/testCase7";

const TestCases: Record<string, JSX.Element> = {
  TestCase1: <TestCase1 />,
  TestCase2: <TestCase2 />,
  TestCase3: <TestCase3 />,
  TestCase4: <TestCase4 />,
  TestCase5: <TestCase5 />,
  TestCase6: <TestCase6 />,
  TestCase7: <TestCase7 />,
};

function App() {
  const [testCase, setTestCase] = useState<string | null>(null);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Porównanie wydajności systemów bazodanowych</h1>

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
        {testCase ? (
          <>
            <button
              onClick={() => setTestCase(null)}
              style={{ cursor: "pointer" }}
            >
              X
            </button>
            {TestCases[testCase]}
          </>
        ) : (
          <div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase1")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 1 - Select na danych bez porządku</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase2")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 2 - Select na danych wraz z sortowaniem</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase3")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 3 - Obliczenia średnich</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase4")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 4 - Filtrowanie danych</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase5")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 5 - Update wartości pola</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase6")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 6 - Usuwanie wartości z przedziału</h3>
            </div>
            <div
              role="button"
              onClick={() => setTestCase("TestCase7")}
              style={{ padding: 8, cursor: "pointer" }}
            >
              <h3>Test case 7 - Dodanie nowych wartości</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
