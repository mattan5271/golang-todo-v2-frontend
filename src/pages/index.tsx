import type { NextPage } from "next";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

const Home: NextPage = () => {
  const [string, setString] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}`)
      .then((res: AxiosResponse) => {
        setString(res.data);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err);
      });
  }, []);

  return <h1>{string}</h1>;
};

export default Home;
