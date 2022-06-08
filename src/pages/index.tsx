import type { NextPage } from "next";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Button, Center, Container, Table, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export type Todo = {
  id: number;
  title: string;
  description: string;
};

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
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
        console.log(res);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/todos`)
      .then((res: AxiosResponse) => {
        setTodos(res.data);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <form onSubmit={form.onSubmit((formValues: FormValues) => handleSubmit(formValues))}>
        <TextInput required label="タイトル" {...form.getInputProps("title")} />
        <Textarea label="説明文" description="50文字以下で入力してください" mt="md" {...form.getInputProps("description")} />
        <Center my="md">
          <Button type="submit" color="green">
            Todoを登録
          </Button>
        </Center>
      </form>

      <Table>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>説明文</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: Todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
