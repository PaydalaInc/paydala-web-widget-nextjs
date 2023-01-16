import { GetServerSideProps } from "next/types";
import Head from "next/head";
import { getApiUrl } from "@paydala-payments/react-web-sdk";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface WidgetProps {
  CJWT: string;
  environment: string;
  isWebView: boolean;
}

function Home({ CJWT, environment, isWebView }: WidgetProps) {
  const { push } = useRouter();
  const { mutate: identifyPartner } = useMutation(
    ({
      CJWT,
      environment,
      latitude,
      longitude,
    }: {
      CJWT: string;
      environment: string;
      latitude: number;
      longitude: number;
    }) => {
      return fetch(
        `${getApiUrl(
          environment
        )}/auth-service/identifyPartner?geoLat=${latitude}&geoLong=${longitude}`,
        {
          headers: {
            Authorization: `Bearer :${CJWT}`,
          },
        }
      );
    }
  );

  useEffect(() => {
    if (CJWT === undefined) return;
    if (environment === undefined) return;
    navigator.geolocation.getCurrentPosition(function (position) {
      identifyPartner(
        {
          CJWT,
          environment,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        {
          onSuccess: (data) => {
            console.log({ data });
            if (isWebView) {
              push(`/widget/${CJWT}/${environment}`);
            }
          },
        }
      );
    });
  }, [CJWT, environment, identifyPartner, isWebView, push]);
  return (
    <>
      <Head>
        <title>Validating Payment Widget</title>
        <meta name="description" content="Making payment easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center h-screen">
        Validating Payment Widget
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<WidgetProps> = async (
  context
) => {
  const _props: WidgetProps = {
    isWebView: context.query.is_web_view === "true",
    CJWT:
      context.req.headers["authorization"] ??
      (context.query.authorization as string) ??
      "",
    environment: (context.query.environment as string) ?? "",
  };
  console.log({ _props });
  return { props: _props };
};

export default Home;
