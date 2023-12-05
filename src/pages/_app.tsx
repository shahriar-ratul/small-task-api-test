import WindowWrapper from "@/lib/window-wrapper";
import { store } from "@/store/store";

import type { NextPage } from "next";
import Head from "next/head";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import DefaultLayout from "@/core/layouts/DefaultLayout";

import AppThemeProvider from "@/context/theme/AppThemeProvider";

// styles
import "@/styles/style.scss";
// import 'antd/dist/reset.css';

import NextNProgress from "nextjs-progressbar";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppPageMeta from "@/lib/AppPageMeta";

interface PageProps {
  authGuard?: boolean;
}

type ExtendedAppProps = PageProps & {
  // Define any other custom props your page might need
  Component: NextPage & {
    getLayout?: (page: ReactNode) => ReactNode;
    authGuard?: boolean;
    guestGuard?: boolean;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: any;
};

const queryClient = new QueryClient();

const App = (props: ExtendedAppProps) => {
  const { Component, pageProps } = props;

  // Variables
  const getLayout =
    Component.getLayout ?? (page => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <>
      <StyleProvider hashPriority="high">
        <CookiesProvider>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <>
                <Head>
                  <title>{`Dashboard`}</title>
                  <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                  />
                </Head>

                {/* <AuthProvider> */}
                <WindowWrapper>
                  <AppThemeProvider>
                    <AppPageMeta />
                    <NextNProgress color="linear-gradient(90deg, #b656cb, #10a1a0)" />
                    {getLayout(<Component {...pageProps} />)}
                  </AppThemeProvider>
                </WindowWrapper>
              </>
              {/* query dev tools */}
              <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            </Provider>
          </QueryClientProvider>
        </CookiesProvider>
      </StyleProvider>
    </>
  );
};

export default App;
