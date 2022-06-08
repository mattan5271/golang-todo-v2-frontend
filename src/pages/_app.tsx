import type { AppProps } from "next/app";
import { NotificationsProvider } from "@mantine/notifications";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotificationsProvider position="top-right">
      <Component {...pageProps} />
    </NotificationsProvider>
  );
}

export default MyApp;
