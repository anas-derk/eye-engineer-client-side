import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import GeometriesExplorer from "@/components/GeometriesExplorer";

export default function GeometrySubGeometries() {

    const { t } = useTranslation();

    const router = useRouter();

    const { geometryId } = router.query;

    return <>
        <Head>
            <title>{t(process.env.WEBSITE_NAME)} {t("Sub Geometries")}</title>
        </Head>
        <GeometriesExplorer parentGeometryId={geometryId} isSubGeometriesPage />
    </>;
}
