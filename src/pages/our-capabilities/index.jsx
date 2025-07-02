import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Capabilities from "@/components/Capabilities";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";

export default function OurCapabilites() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    return (
        <div className="our-capabilites">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Our Capabilites")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <Capabilities />
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}