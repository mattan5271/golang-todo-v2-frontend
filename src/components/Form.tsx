import { Dispatch, FC, SetStateAction } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Center, Container, Group, Modal, Table, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Todo } from "types";

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  buttonText: string;
  buttonColor: string;
};

export const Form: FC<Props> = (props) => {
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },

    validate: {
      description: (value) => (value.length > 50 ? "説明文は50文字以内にしてください" : null),
    },
  });
  type FormValues = typeof form.values;

  const handleSubmit = (formValues: FormValues): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/todos`, formValues)
      .then((res: AxiosResponse) => {
        props.setTodos([...props.todos, res.data]);
        form.reset();
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={form.onSubmit((formValues: FormValues) => handleSubmit(formValues))}>
      <TextInput required label="タイトル" {...form.getInputProps("title")} />
      <Textarea label="説明文" description="50文字以下で入力してください" mt="md" {...form.getInputProps("description")} />
      <Center my="md">
        <Button type="submit" color={props.buttonColor}>
          {props.buttonText}
        </Button>
      </Center>
    </form>
  );
};
