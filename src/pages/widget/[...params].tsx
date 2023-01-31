import { useEffect, useState } from "react";

import { Container } from "@chakra-ui/react";
import Head from "next/head";
import { PaydalaWidget } from "@paydala-payments/react-web-sdk";
import { useRouter } from "next/router";

function Widget() {
  const { asPath, query } = useRouter();
  const { params } = query;
  const [URL, setURL] = useState<string>("");
  useEffect(() => {
    if (window?.location?.origin) {
      setURL(`${window.location.origin}${asPath}`);
    }
  }, [asPath]);

  if (!params || params.length < 2) {
    return null;
  }
  let prefill = undefined;
  if (params[2]) {
    prefill = JSON.parse(params[2]);
  }
  console.log({ prefill });
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
          operatorJWT={params[0]}
          environment={params[1]}
          defaultUser={prefill}
          isWebView={true}
          onClose={(e: any) => console.log({ onClose: e })}
        />
      </Container>
    </>
  );
}

export default Widget;
