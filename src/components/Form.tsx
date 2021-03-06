import { Dispatch, FC, SetStateAction } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Center, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Todo } from "types";

type Props = {
  buttonText: string;
  buttonColor: string;
  todo?: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setOpened?: Dispatch<SetStateAction<boolean>>;
};

export const Form: FC<Props> = (props) => {
  const form = useForm({
    initialValues: {
      title: props.todo ? props.todo.title : "",
      description: props.todo ? props.todo.description : "",
    },

    validate: {
      description: (value) => (value.length > 50 ? "説明文は50文字以内にしてください" : null),
    },
  });
  type FormValues = typeof form.values;

  const handleSubmit = (formValues: FormValues): void => {
    if (props.todo) {
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/todos/${props.todo.id}`, formValues)
        .then((res: AxiosResponse) => {
          props.setTodos(props.todos.map((todo: Todo) => (todo.id === props.todo?.id ? res.data : todo)));
          form.reset();
          props.setOpened && props.setOpened(false);
          showNotification({
            message: "Todoを更新しました",
            color: "green",
          });
        })
        .catch((err: AxiosError<{ error: string }>) => {
          console.log(err);
        });
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/todos`, formValues)
        .then((res: AxiosResponse) => {
          props.setTodos([...props.todos, res.data]);
          form.reset();
          showNotification({
            message: "Todoを作成しました",
            color: "green",
          });
        })
        .catch((err: AxiosError<{ error: string }>) => {
          console.log(err);
        });
    }
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
