import "./spinner.css";

export const Spinner = () => (
  <div
    style={{
      marginTop: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);
