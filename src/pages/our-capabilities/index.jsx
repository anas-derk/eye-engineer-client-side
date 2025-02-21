import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import Link from "next/link";
import Capabilities from "@/components/Capabilities";

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
                <title>{t([process.env.websiteName])} {t("Our Capabilites")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <Capabilities />
                </div>
                {/* End Page Content */}
            </>}
        </div>
    );
}