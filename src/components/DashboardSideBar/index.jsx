import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineEye, AiOutlinePropertySafety, AiOutlineTranslation } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaLink, FaUsers } from "react-icons/fa6";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { LuFiles } from "react-icons/lu";
import { MdMenu, MdMenuOpen, MdOutlineLogout, MdOutlineMessage, MdOutlineVpnKey } from "react-icons/md";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbGeometry } from "react-icons/tb";

const STORAGE_KEY = "ee-dashboard-sidebar-expanded";

const WIDTH_COLLAPSED = 56;
const WIDTH_EXPANDED = 232;

function isRouteActive(pathname, href) {
    if (pathname === href) {
        return true;
    }
    if (href === "/dashboard") {
        return false;
    }
    return pathname.startsWith(`${href}/`);
}

function applySidebarWidthPx(px) {
    if (typeof document === "undefined") {
        return;
    }
    document.documentElement.style.setProperty("--dashboard-sidebar-width", `${px}px`);
}

export default function DashboardSideBar({ isWebsiteOwner = false, isEngineer = false }) {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "0") {
            setExpanded(false);
        } else if (saved === "1") {
            setExpanded(true);
        }
    }, []);

    const widthPx = expanded ? WIDTH_EXPANDED : WIDTH_COLLAPSED;

    useEffect(() => {
        applySidebarWidthPx(widthPx);
        return () => {
            applySidebarWidthPx(WIDTH_COLLAPSED);
        };
    }, [widthPx]);

    const ownerSection = useMemo(
        () =>
            isWebsiteOwner
                ? {
                      id: "owner",
                      title: t("Administration"),
                      items: [
                          { href: "/dashboard/users", label: t("Users"), Icon: FaUsers },
                          { href: "/dashboard/news", label: t("News"), Icon: BiNews },
                          {
                              href: "/dashboard/change-bussiness-email-password",
                              label: t("Change Bussiness Email Password"),
                              Icon: MdOutlineVpnKey,
                          },
                          {
                              href: "/dashboard/show-and-hide-services",
                              label: t("Show / Hide Services"),
                              Icon: AiOutlineEye,
                          },
                          { href: "/dashboard/offices", label: t("Offices"), Icon: HiOutlineOfficeBuilding },
                          { href: "/dashboard/messages", label: t("Messages"), Icon: MdOutlineMessage },
                          {
                              href: "/dashboard/property-valuation-orders",
                              label: t("Property Valuation Orders"),
                              Icon: AiOutlinePropertySafety,
                          },
                          { href: "/dashboard/ads", label: t("Ads"), Icon: RiAdvertisementLine },
                      ],
                  }
                : null,
        [isWebsiteOwner, t, i18n.language],
    );

    const engineerSection = useMemo(
        () =>
            isEngineer
                ? {
                      id: "engineer",
                      title: t("Engineer"),
                      items: [
                          { href: "/dashboard/geometries", label: t("Geometries"), Icon: TbGeometry },
                          { href: "/dashboard/links", label: t("Links"), Icon: FaLink },
                          { href: "/dashboard/files", label: t("Files"), Icon: LuFiles },
                      ],
                  }
                : null,
        [isEngineer, t, i18n.language],
    );

    const commonItems = useMemo(
        () => [{ href: "/dashboard/terminologies-translation", label: t("Terminologies"), Icon: AiOutlineTranslation }],
        [t, i18n.language],
    );

    const toggleExpanded = useCallback(() => {
        setExpanded((v) => {
            const next = !v;
            localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
            return next;
        });
    }, []);

    const userLogout = useCallback(() => {
        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        router.push("/login");
    }, [router]);

    const pathname = router.pathname;

    return (
        <aside
            className="ee-dashboard-sidebar"
            data-expanded={expanded ? "true" : "false"}
            style={{ width: `${widthPx}px` }}
            aria-label={t("Dashboard")}
        >
            <div className="ee-dashboard-sidebar__top">
                <button
                    type="button"
                    className="ee-dashboard-sidebar__toggle"
                    onClick={toggleExpanded}
                    aria-expanded={expanded}
                    aria-controls="ee-dashboard-sidebar-nav"
                    title={expanded ? t("Collapse menu") : t("Expand menu")}
                >
                    {expanded ? <MdMenuOpen className="ee-dashboard-sidebar__toggle-icon" aria-hidden /> : <MdMenu className="ee-dashboard-sidebar__toggle-icon" aria-hidden />}
                </button>
            </div>

            <nav id="ee-dashboard-sidebar-nav" className="ee-dashboard-sidebar__nav" aria-label={t("Dashboard")}>
                {ownerSection && (
                    <section className="ee-dashboard-sidebar__section" aria-labelledby={`ee-sidebar-h-${ownerSection.id}`}>
                        {expanded && (
                            <h2 id={`ee-sidebar-h-${ownerSection.id}`} className="ee-dashboard-sidebar__section-title">
                                {ownerSection.title}
                            </h2>
                        )}
                        <ul className="ee-dashboard-sidebar__list">
                            {ownerSection.items.map((item) => {
                                const active = isRouteActive(pathname, item.href);
                                return (
                                    <li key={item.href} className="ee-dashboard-sidebar__item">
                                        <Link
                                            href={item.href}
                                            className={`ee-dashboard-sidebar__link${active ? " ee-dashboard-sidebar__link--active" : ""}`}
                                            aria-current={active ? "page" : undefined}
                                            title={!expanded ? item.label : undefined}
                                        >
                                            <item.Icon className="ee-dashboard-sidebar__icon" aria-hidden />
                                            {expanded && <span className="ee-dashboard-sidebar__label">{item.label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                {engineerSection && (
                    <section className="ee-dashboard-sidebar__section" aria-labelledby={`ee-sidebar-h-${engineerSection.id}`}>
                        {expanded && (
                            <h2 id={`ee-sidebar-h-${engineerSection.id}`} className="ee-dashboard-sidebar__section-title">
                                {engineerSection.title}
                            </h2>
                        )}
                        <ul className="ee-dashboard-sidebar__list">
                            {engineerSection.items.map((item) => {
                                const active = isRouteActive(pathname, item.href);
                                return (
                                    <li key={item.href} className="ee-dashboard-sidebar__item">
                                        <Link
                                            href={item.href}
                                            className={`ee-dashboard-sidebar__link${active ? " ee-dashboard-sidebar__link--active" : ""}`}
                                            aria-current={active ? "page" : undefined}
                                            title={!expanded ? item.label : undefined}
                                        >
                                            <item.Icon className="ee-dashboard-sidebar__icon" aria-hidden />
                                            {expanded && <span className="ee-dashboard-sidebar__label">{item.label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                <section className="ee-dashboard-sidebar__section">
                    <ul className="ee-dashboard-sidebar__list">
                        {commonItems.map((item) => {
                            const active = isRouteActive(pathname, item.href);
                            return (
                                <li key={item.href} className="ee-dashboard-sidebar__item">
                                    <Link
                                        href={item.href}
                                        className={`ee-dashboard-sidebar__link${active ? " ee-dashboard-sidebar__link--active" : ""}`}
                                        aria-current={active ? "page" : undefined}
                                        title={!expanded ? item.label : undefined}
                                    >
                                        <item.Icon className="ee-dashboard-sidebar__icon" aria-hidden />
                                        {expanded && <span className="ee-dashboard-sidebar__label">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </nav>

            <div className="ee-dashboard-sidebar__footer">
                <button
                    type="button"
                    className="ee-dashboard-sidebar__link ee-dashboard-sidebar__link--logout"
                    onClick={userLogout}
                    title={!expanded ? t("Logout") : undefined}
                >
                    <MdOutlineLogout className="ee-dashboard-sidebar__icon" aria-hidden />
                    {expanded && <span className="ee-dashboard-sidebar__label">{t("Logout")}</span>}
                </button>
            </div>
        </aside>
    );
}
