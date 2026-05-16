import Head from "next/head";
import { useTranslation } from "react-i18next";
import GeometriesExplorer from "@/components/GeometriesExplorer";

export default function Geometries() {

    const { t } = useTranslation();

    return <>
        <Head>
            <title>{t(process.env.WEBSITE_NAME)} {t("Geometries")}</title>
        </Head>
        <GeometriesExplorer />
    </>;
}
