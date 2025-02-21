import { useTranslation } from "react-i18next";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import Link from "next/link";
import ServiceImage1 from "../../../public/images/Services/Geometries.png";
import ServiceImage2 from "../../../public/images/Services/EducationalVideos.png";
import ServiceImage3 from "../../../public/images/Services//EngineeringArticles.png";
import ServiceImage4 from "../../../public/images/Services/Recents.png";
import ServiceImage5 from "../../../public/images/Services/Terminologies.png";
import ServiceImage6 from "../../../public/images/Services/Offices.png";
import ServiceImage7 from "../../../public/images/Services/PropertyValuation.png";

export default function Capabilities() {

    const { t } = useTranslation();

    const servicesData = [
        {
            title: "Geometries",
            description: "Contains diverse engineering information and resources",
            imageSrc: ServiceImage1.src,
        },
        {
            title: "Educational Videos",
            description: "Provides a collection of instructional videos",
            imageSrc: ServiceImage2.src,
        },
        {
            title: "Engineering Articles",
            description: "Contains diverse articles",
            imageSrc: ServiceImage3.src,
        },
        {
            title: "Recents",
            description: "Provides the latest information and news",
            imageSrc: ServiceImage4.src,
        },
        {
            title: "Terminologies",
            description: "Provides definitions of technical and professional terms",
            imageSrc: ServiceImage5.src,
        },
        {
            title: "Offices",
            description: "Offers tips and ideas to enhance the work environment in offices",
            imageSrc: ServiceImage6.src,
        },
        {
            title: "Property Valuation",
            description: "Provides property valuations by experts",
            imageSrc: ServiceImage7.src,
        },
    ];

    return (
        <div className="our-capabilities">
            {/* Start Page Content */}
            <div className="page-content">
                <h1 className="section-name text-center mb-4 text-white h5">{t("Our Capabilities")}</h1>
                <div className="container pt-4 pb-4">
                    <div className="row align-items-center">
                        {servicesData.map((service, index) => (
                            <motion.div
                                className="col-lg-4 mb-4"
                                key={index}
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                                whileHover={{
                                    scale: 1.1
                                }}
                            >
                                <div className="service-info-box info-box p-3 text-center">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <img src={service.imageSrc} alt={`${service.title} Image !`} width="100" height="100" />
                                        </div>
                                        <div className="col-md-8 text-center">
                                            <h6 className="mb-3 fw-bold">{t(service.title)}</h6>
                                            <p className="mb-3 d-block">{t(service.description)}</p>
                                            <Link href="/" className="orange-btn d-block">{t("View")}</Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
            {/* End Page Content */}
        </div>
    );
}