import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Header from "@/components/Header";
import LoaderPage from "@/components/LoaderPage";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

  const { i18n, t } = useTranslation();

  useEffect(() => {

    setIsLoadingPage(false);

  }, []);

  return (
    <div className="home">
      <Head>
        <title>{t([process.env.websiteName])} Home</title>
      </Head>
      {!isLoadingPage && !errorMsgOnLoadingThePage && <>
        <Header />
        <h1 className="text-center font-bold text-[25px]">Hello In Eye Enginner !!</h1>
      </>}
      {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
      {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
    </div>
  );
}