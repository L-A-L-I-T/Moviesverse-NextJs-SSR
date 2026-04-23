import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/movies",
      permanent: false,
    },
  };
};

export default function Index() {
  return null;
}
