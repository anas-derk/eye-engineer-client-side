import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import Footer from "@/components/Footer";
import { motion } from "motion/react";

export default function PrivacyPolicy() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (userToken) {
            getUserInfo()
                .then((result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                    }
                    setIsLoadingPage(false);
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        setIsLoadingPage(false);
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else {
            setIsLoadingPage(false);
        }
    }, []);

    return (
        <div className="privacy-policy">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} - {t("Privacy Policy")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <div className="page-content">
                    <div className="container-fluid">
                        <motion.h1 className="section-name text-center mb-4 text-white h5" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}> {t("Articles Policy")}</motion.h1>
                        <div className="content">
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Introduction")}</motion.h2>
                            <ul>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("{{WEBSITE_NAME}} website recognizes the importance of protecting your personal information. We have prepared this privacy policy to provide you with important information about the privacy practices applied to the {{WEBSITE_NAME}} platform and any website or service linked to or referred to by this privacy policy (collectively referred to as 'the Services')", { WEBSITE_NAME: process.env.WEBSITE_NAME })} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("{{WEBSITE_NAME}} operates by assisting you in finding reliable and engineering-related information and connecting you with the best engineers to share information with", { WEBSITE_NAME: process.env.WEBSITE_NAME })} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("{{WEBSITE_NAME}} works by linking you with engineers as quickly as possible when you need information (in the appropriate manner for virtual consultations) directly from your computer or mobile phone", { WEBSITE_NAME: process.env.WEBSITE_NAME })} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("By continuing to use {{WEBSITE_NAME}} website, you agree to this privacy policy and any updates made to it. This means that if changes are made to the privacy policy, you agree to those changes by continuing to use {{WEBSITE_NAME}}. When changes are made to this policy (other than changes made to correct typographical errors or minor changes that do not alter its meaning), we will update the 'Last Modified' date at the top of the policy", { WEBSITE_NAME: process.env.WEBSITE_NAME })} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("In the bottom part of the policy, we may provide a summary describing the types of changes that have been made")} .</motion.li>
                            </ul>
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Terms and Conditions of Website Use")}</motion.h2>
                            <ul>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("By using the website, you agree not to use any device, software, or routine to interfere or attempt to interfere with the proper functioning of the website or any transaction conducted on the website, or with any use of the website by another person")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("You are not allowed to manipulate addresses or identifiers to conceal the origin of any message")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Impersonation of any individual or entity is strictly prohibited")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("You may not use the website or any content for any unlawful or prohibited purpose under these terms of use")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("It is your responsibility to keep your account and passwords secure. Any breach of your account may lead to issues for another user or potentially for our website and services. Therefore, you are entirely responsible for the security of your account on the website")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("You should be aware that any messages or transactions you perform might be visible to others with the intention of exploitation")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The website cannot guarantee that any files or data you download from the website will be free from viruses, contaminants, or supporting features")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("You bear full responsibility for your use of the website, and you are responsible for any damages, liabilities, or injuries resulting from any failure in performance, error, negligence, interruption, deletion, defect, delay in operation, transmission, computer virus, communication line failure, theft, destruction, or unauthorized access")} .</motion.li>
                            </ul>
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Collecting Information")}</motion.h2>
                            <ul>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("When you use our services, we may collect the following types of information")} :</motion.li>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Information You Provide Directly")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("For certain activities, such as when you register, subscribe to our notifications, or directly communicate with us; we may collect some or all of the following types of information")} .</motion.li>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Registration: Contact information, such as your name, email address, date of birth, and mobile phone number")} .</motion.li>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Payment Information: When using paid services on {{WEBSITE_NAME}}, we require payment information. If you make a payment using a credit card or local debit card, we will collect specific information such as your credit card or debit card number, expiration date, and security code. Additionally, the service provider (a third party assisting or representing us in facilitating our services) managing our payment operations will obtain information from your credit card or debit card. Their use of this information will be governed by their own privacy policy")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Engineering Information Providers")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We will collect specific information about your work, such as job title, field of practice, primary specialization, gender, date of birth, languages spoken, address, image, professional license information, and banking account information")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Other Information")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Additionally, we will collect any other information you provide to us")} .</motion.li>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("It is important to note that any payment information collected is processed in accordance with the privacy policy of the payment service provider, a third party involved in handling our payment operations")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Automatically Collected Information")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("When you use our services, we may automatically collect certain types of information, including but not limited to")} :</motion.li>
                                    <motion.h4
                                        className="fw-bold mb-4 h6 border-bottom border-2 w-fit pb-2"
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings}
                                    >{t("IP Address and Device Identifiers")}</motion.h4>
                                    <ul>
                                        <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Information such as IP address, device identifiers, advertising identifiers, browser type, operating system, internet service provider, pages visited before and after using the services, date and time of visit, and standard server log information")} .</motion.li>
                                    </ul>
                                    <motion.h4
                                        className="fw-bold mb-4 h6 border-bottom border-2 w-fit pb-2"
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings}
                                    >{t("Cookies, Pixel Tags, and Local Shared Objects")}</motion.h4>
                                    <ul>
                                        <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may use cookies, pixel tags, and local shared objects (also known as 'Flash cookies') to automatically collect information. Cookies are small pieces of information stored by your web browser on your computer. Pixel tags are tiny images or small parts of data embedded in images, also known as 'web beacons' or 'clear GIFs', which can recognize cookies and the time and date a page was viewed, as well as describe the page where the pixel tag is placed. Local shared objects are similar to standard cookies but may be larger in size and are downloaded to your computer or mobile device by the Adobe Flash player. By using our services, you agree to our use of cookies, pixel tags, local shared objects, and similar technologies")} .</motion.li>
                                    </ul>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Local Shared Objects (Flash Cookies)")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Local shared objects, sometimes referred to as 'Flash cookies,' are similar to standard cookies except that they may be larger in size and are downloaded to your computer or mobile device by the Adobe Flash player. By using our services, you agree to our use of cookies, pixel tags, local shared objects, and similar technologies")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Technical Data for Troubleshooting")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may also collect technical data for processing and troubleshooting technical issues and improving our services. This may include information about the state of your device's memory in the event of a system or application failure while using our services. Your device or browser settings may allow you to control the collection of this technical data. This data may include portions of a document you were using when a problem occurred or the contents of your communications. By using the services, you agree to the collection of this technical data")} .</motion.li>
                                </ul>
                            </ul>
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Use of Information")}</motion.h2>
                            <ul>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("In general, we use the information we collect online for the following purposes")} :</motion.li>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Operating and Providing Services")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Operating, providing, maintaining, improving, and enhancing our services")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Personalizing Your Experience")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Personalizing your experience with us, such as providing customized content and recommendations. For example, using your email address to help you create and manage your account and delivering personalized information relevant to you")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Creating a Profile and Automated Decision-Making")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Creating a profile about you and making automated decisions based on your information to generate better answers to questions. This information is not used for marketing purposes")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Connecting You with Engineers")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Facilitating connections with engineers who meet your nee")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Marketing and Advertising")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Achieving marketing and advertising purposes, including developing and providing promotional materials and advertisements that may be relevant or valuable to you")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Communication")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Communicating with you via email, text messages, push notifications, and phone calls to provide you with updates, information related to our services, respond to inquiries, and offer customer service")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Facilitating Transactions and Payments")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Facilitating transactions and payment processes if applicable")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Linking Social Media Accounts")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Facilitating linking of social media accounts to our services to provide information from those accounts to your profile. Based on your chosen social media accounts and subject to your privacy settings, we will input, enable, and store (if applicable and permitted by the social media service and by you) information from your social media accounts so that it is available on and through your profile on our services")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Business Operations")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Achieving our business purposes, such as auditing operations, quality assurance purposes, fraud detection and prevention, and responding to issues related to trust and safety")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Compliance Purposes")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Achieving compliance purposes, including enforcing our terms and conditions or other legal rights, or as required by applicable laws and regulations, or as requested by any judicial proceedings or required by any government entity")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Other Purposes")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Achieving other purposes about which we provide specific notice at the time of information collection")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Aggregate or De-Identified Information")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Aggregating or de-identifying information collected through the services and using it for other business purposes after it can no longer be reasonably linked to an identifiable person")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Marketing Products and Services")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Marketing products and services, including through inferred interests from interactions with our websites and applications")} .</motion.li>
                                </ul>
                            </ul>
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Sharing of Information")}</motion.h2>
                            <ul>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We are committed to maintaining your trust, and we need you to understand and acknowledge when and with whom we may share the information we collect. We may share your information with accredited engineering service providers and unions")} .</motion.li>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Authorized External Suppliers and Service Providers")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may share your information with external suppliers and service providers working to assist us in specialized services, including invoicing, payment processing, customer service, email distribution, business analytics, marketing (including, but not limited to, advertising, customization, deep linking, mobile marketing, performance optimization, retargeting), advertising, performance monitoring, hosting, and data processing. External suppliers and service providers are not allowed to use your information for purposes other than those related to the services they provide to us")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Research Partners")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may share your information with our research partners to conduct engineering-related research")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Affiliated Companies")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may share your information with our affiliated companies subject to this policy")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("With Your Consent or Direction")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("We may share your information for any other purposes that you are informed of at the time of information collection or based on your consent or direction")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Third-Party Services")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("If you log into third party services such as Facebook or Google through our services to log in or share information with others about your experience with us, those services may collect information about you, including information about your activity on the site. They may also report communications you make on third-party services regarding your use of the site in accordance with their privacy policies")} .</motion.li>
                                </ul>
                                <motion.h3
                                    className="fw-bold mb-4 h5 border-bottom border-2 w-fit pb-2"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                >{t("Public Activities and External Websites")}</motion.h3>
                                <ul>
                                    <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("If you choose to participate in public activities on the site or external websites linked to it, you should be aware that any information you share on those sites might be read, collected, or used by other users in those spaces. Exercise caution when disclosing personal information while participating in those public spaces. We are not responsible for the information you choose to submit in these public spaces")} .</motion.li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}