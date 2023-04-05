import { useForm } from "react-hook-form";

export type FormData = {
  queriesNumber: number;
  name: string;
};

type Props = {
  onSubmit: (data: FormData) => void;
};
export const Form = ({ onSubmit }: Props) => {
  const { register, handleSubmit } = useForm<FormData>();
  const handler = handleSubmit((data) => {
    data = { ...data, queriesNumber: Number(data.queriesNumber) };
    onSubmit(data);
  });

  return (
    <form
      onSubmit={handler}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <div>
        <label>Name: </label>
        <input {...register("name")} />
      </div>

      <div>
        <label>Query Number: </label>
        <input type="number" {...register("queriesNumber")} />
      </div>

      <button type="submit" style={{ width: 100 }}>
        Submit
      </button>
    </form>
  );
};
