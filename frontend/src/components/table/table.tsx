import { PropsWithChildren } from "react";
import "./table.css";

export const Table = ({ children }: PropsWithChildren) => (
  <table className="styled-table">{children}</table>
);
