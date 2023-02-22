import { PaydalaWidget, Prefill } from "@paydala-payments/react-web-sdk";
import { useEffect, useState } from "react";

import { Container } from "@chakra-ui/react";
import { Environment } from "@paydala-payments/react-web-sdk/dist/models/paydala";
import { GetServerSideProps } from "next/types";
import Head from "next/head";
import { useRouter } from "next/router";

interface WidgetProps {
  CJWT: string;
  environment: Environment;
  prefill: Prefill | null;
}

function Home({ CJWT, environment, prefill }: WidgetProps) {
  const { asPath } = useRouter();
  const [URL, setURL] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // browser code
      if (window?.location?.origin) {
        setURL(`${window.location.origin}${asPath}`);
      }
    }
  }, [asPath]);
  if (URL === "") return null;
  return (
    <>
      <Head>
        <title>Paydala Payment Widget</title>
        <meta name="description" content="Making payment easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        maxW={"container.sm"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <PaydalaWidget
          redirectUrl={URL}
          operatorJWT={CJWT}
          environment={environment}
          defaultUser={prefill}
          isWebView={true}
          onClose={(e: any) => console.log({ onClose: e })}
        />
      </Container>
    </>
  );
}
export const getServerSideProps: GetServerSideProps<WidgetProps> = async (
  context
) => {
  let prefill = null;
  try {
    prefill = context.req.headers["prefill"]
      ? JSON.parse((context.req.headers["prefill"] as string).slice(0, -1))
      : context.query?.prefill
      ? JSON.parse((context.query.prefill as string).slice(0, -1))
      : null;
  } catch (e) {
    prefill = null;
  }

  const CJWT =
    context.req.headers["authorization"] ??
    (context.query?.authorization as string) ??
    null;
  const environment = context.query.environment
    ? (context.query?.environment as string)
    : "development";
  if (CJWT === null) {
    return {
      redirect: {
        destination: "/error",
        permanent: true,
      },
    };
  } else {
    return {
      props: {
        CJWT,
        environment: environment as Environment,
        prefill,
      },
    };
  }
};

export default Home;
