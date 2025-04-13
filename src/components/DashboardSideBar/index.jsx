import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { BiNews } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

export default function DashboardSideBar() {

    const router = useRouter();

    const { i18n, t } = useTranslation();

    const userLogout = () => {
        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
        router.push("/login");
    }

    return (
        <aside className="dashboard-side-bar managment-links">
            <ul className="managment-customer-account-link-list managment-link-list">
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/users"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/users" && "active"}`}
                    >
                        <FaUsers className={`customer-account-managment-link-icon managment-link-icon ${i18n.language !== "ar" ? "me-3" : "ms-3"}`} />
                        <span className="customer-dashboard-link-name managment-link-name">{t("Users")}</span>
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("Users")}
                    </div>
                </li>
                <li className="managment-customer-account-link-item managment-link-item">
                    <Link
                        href="/news"
                        className={`w-100 d-block managment-customer-account-link managment-link fw-bold ${router.pathname === "/users" && "active"}`}
                    >
                        <BiNews className={`customer-account-managment-link-icon managment-link-icon ${i18n.language !== "ar" ? "me-3" : "ms-3"}`} />
                        <span className="customer-dashboard-link-name managment-link-name">{t("News")}</span>
                    </Link>
                    <div className="link-name-box p-2 fw-bold">
                        {t("News")}
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
                        <MdOutlineLogout className={`customer-account-managment-link-icon managment-link-icon ${i18n.language !== "ar" ? "me-3" : "ms-3"}`} />
                        <span className="customer-dashboard-link-name managment-link-name">{t("Logout")}</span>
                    </Link>
                </li>
            </ul>
        </aside>
    );
}