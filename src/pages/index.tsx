import type { NextPage } from "next";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Container, Group, Modal, Table } from "@mantine/core";
import { Todo } from "types";
import { Form } from "components/Form";
import { showNotification } from "@mantine/notifications";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [opened, setOpened] = useState<boolean>(false);
  const [openedTodo, setOpenedTodo] = useState<Todo>();

  const clickEditButton = (todo: Todo): void => {
    setOpened(true);
    setOpenedTodo(todo);
  };

  const handleDeleteTodo = (id: number): void => {
    if (!confirm("本当に削除しますか？")) return;
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`)
      .then((res: AxiosResponse) => {
        setTodos(todos.filter((todo: Todo) => todo.id !== id));
        setOpened(false);
        showNotification({
          message: "Todoを削除しました",
          color: "red",
        });
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
      <Form todos={todos} setTodos={setTodos} buttonText="Todoを登録" buttonColor=""></Form>

      <Table verticalSpacing="md" highlightOnHover>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>説明文</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: Todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>
                <Button color="green" onClick={() => clickEditButton(todo)}>
                  編集
                </Button>
                <Modal opened={opened} onClose={() => setOpened(false)} title="Todo更新" transitionDuration={300}>
                  <Form todos={todos} setTodos={setTodos} setOpened={setOpened} todo={openedTodo} buttonText="Todoを更新" buttonColor="green"></Form>
                  <Group position="right">
                    <Button color="red" onClick={() => openedTodo && handleDeleteTodo(openedTodo.id)}>
                      削除
                    </Button>
                  </Group>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
