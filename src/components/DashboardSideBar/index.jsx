import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineTranslation } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

export default function DashboardSideBar() {

    const router = useRouter();

    const { t } = useTranslation();

    const userLogout = () => {
        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
        router.push("/login");
    }

    return (
        <aside className="dashboard-side-bar managment-links">
            <ul className="managment-customer-account-link-list managment-link-list">
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/dashboard/users"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/users" && "active"}`}
                    >
                        <FaUsers className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Users")}
                    </div>
                </li>
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/dashboard/news"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/news" && "active"}`}
                    >
                        <BiNews className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("News")}
                    </div>
                </li>
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/dashboard/change-bussiness-email-password"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/change-bussiness-email-password" && "active"}`}
                    >
                        <BiNews className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Change Bussiness Email Password")}
                    </div>
                </li>
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/dashboard/show-and-hide-services"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/show-and-hide-services" && "active"}`}
                    >
                        <AiOutlineEye className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Show / Hide Services")}
                    </div>
                </li>
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/dashboard/terminologies-translation"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/terminologies-translation" && "active"}`}
                    >
                        <AiOutlineTranslation className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Terminologies")}
                    </div>
                </li>
                <li
                    className="managment-customer-account-link-item managment-link-item"
                    onClick={userLogout}
                >
                    <Link
                        href="#"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/users" && "active"}`}
                    >
                        <MdOutlineLogout className="customer-account-managment-link-icon managment-link-icon" />
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Logout")}
                    </div>
                </li>
            </ul>
        </aside>
    );
}