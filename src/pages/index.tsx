import type { NextPage } from "next";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Button, Center, Container, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const Home: NextPage = () => {
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
    console.log(formValues);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/todos`, formValues)
      .then((res: AxiosResponse) => {
        console.log(res);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err);
      });
  };

  // useEffect(() => {}, []);

  return (
    <Container>
      <form onSubmit={form.onSubmit((formValues: FormValues) => handleSubmit(formValues))}>
        <TextInput required label="タイトル" {...form.getInputProps("title")} />
        <Textarea label="説明文" description="50文字以下で入力してください" mt="md" {...form.getInputProps("description")} />
        <Center mt="md">
          <Button type="submit" color="green">
            Todoを登録
          </Button>
        </Center>
      </form>
    </Container>
  );
};

export default Home;
