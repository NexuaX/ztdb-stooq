import { format } from "date-fns";

export const dateFormatter = (date: number) => {
  return format(new Date(date), "dd/MMM");
};
