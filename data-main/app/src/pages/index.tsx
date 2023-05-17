import type { GetServerSidePropsContext } from "next";

export default function Index() {
  return null;
}

export function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader("location", "/dashboard");
  res.statusCode = 302;
  res.end();
  return { props: {} };
}
