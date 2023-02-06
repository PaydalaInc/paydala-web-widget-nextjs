import { Center, Container, Spinner, Text, VStack } from "@chakra-ui/react";
import { Partner, Prefill, getApiUrl } from "@paydala-payments/react-web-sdk";
import { useEffect, useState } from "react";

import { GetServerSideProps } from "next/types";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface WidgetProps {
  CJWT: string | null;
  environment: string | null;
  prefill: Prefill | null;
}

function Home({ CJWT, environment, prefill }: WidgetProps) {
  const { push } = useRouter();
  const [partner, setPartner] = useState<Partner | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (partner !== undefined) {
        push(`/widget/${CJWT}/${environment}/${JSON.stringify(prefill)}`);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [CJWT, environment, partner, prefill, push]);

  const { mutate: identifyPartner } = useMutation(
    async ({
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
      const response = await fetch(
        `${getApiUrl(
          environment
        )}/auth-service/identifyPartner?geoLat=${latitude}&geoLong=${longitude}`,
        {
          headers: {
            Authorization: `Bearer :${CJWT}`,
          },
        }
      );
      const responseJson = await response.json();
      if (response.status === 403) {
        throw new Error(responseJson.error ?? "Unable to identify partner");
      }
      if (response.status === 200) {
        return responseJson;
      } else {
        throw new Error(responseJson.error ?? "Unable to identify partner");
      }
    }
  );

  useEffect(() => {
    if (CJWT === null) return;
    if (environment === null) return;
    navigator.geolocation.getCurrentPosition((position) => {
      identifyPartner(
        {
          CJWT,
          environment,
          // latitude: 12.928764,
          // longitude: 77.636692,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        {
          onSuccess: (data) => {
            setPartner(data.response);
          },
          onError: (e: any) => {
            setError(e.message);
          },
        }
      );
    });
  }, [CJWT, environment, identifyPartner, push]);

  return (
    <>
      <Head>
        <title>Validating Payment Widget</title>
        <meta name="description" content="Making payment easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        maxW={"container.sm"}
        display="flex"
        height={"100vh"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Center>
          <VStack spacing={3}>
            {!error && <Spinner ringColor={"blue"} />}
            <Text color={!!error ? "red" : "blue"}>
              {error
                ? error
                : partner
                ? `Redirecting to ${partner.partner.company} payment widget...`
                : "Validating Payment flow..."}
            </Text>
          </VStack>
        </Center>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<WidgetProps> = async (
  context
) => {
  let prefill = null;
  try {
    prefill =
      context.req.headers["prefill"] ?? context.query.prefill
        ? JSON.parse((context.query.prefill as string).slice(0, -1))
        : null;
  } catch (e) {
    prefill = null;
  }
  const _props: WidgetProps = {
    CJWT:
      context.req.headers["authorization"] ??
      (context.query.authorization as string) ??
      null,
    environment: context.query.environment
      ? (context.query.environment as string)
      : null,
    prefill,
  };
  return { props: _props };
};

export default Home;
