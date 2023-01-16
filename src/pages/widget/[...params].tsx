import { useEffect, useState } from "react";

import { GetServerSideProps } from "next/types";
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
  return (
    <>
      <Head>
        <title>Paydala Payment Widget</title>
        <meta name="description" content="Making payment easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PaydalaWidget
          redirectUrl={URL}
          operatorJWT={params[0]}
          environment={params[1]}
          isWebView={true}
          onClose={(e: any) => console.log({ onClose: e })}
        />
      </main>
    </>
  );
}

export default Widget;
