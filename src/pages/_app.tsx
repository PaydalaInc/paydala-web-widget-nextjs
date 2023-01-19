import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
