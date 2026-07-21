"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageContext";

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const { language, setLanguage, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = !!session;
    const role = session?.user?.role;

    const loggedOutLinks = [
        { href: "/", label: t("nav.home") },
        { href: "/explore", label: t("nav.explore") },
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
    ];

    const loggedInLinks = [
        { href: "/", label: t("nav.home") },
        { href: "/explore", label: t("nav.explore") },
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
        ...(role !== "Tenant" ? [{ href: "/missions/add", label: t("nav.post_mission") }] : []),
        ...(role !== "Tenant" ? [{ href: "/missions/manage", label: "Manage" }] : []),
        { href: "/dashboard", label: t("nav.dashboard") },
    ];

    const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary whitespace-nowrap shrink-0">
                    <span>🛟</span> RescueLink
                </Link>

                <div className="hidden lg:flex items-center gap-6 shrink-0">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-600 hover:text-primary whitespace-nowrap">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-3 shrink-0">
                    {/* Language Switcher Toggle */}
                    <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold border border-neutral-200">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-2 py-1 rounded-md transition-all ${
                                language === "en" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage("bn")}
                            className={`px-2 py-1 rounded-md transition-all ${
                                language === "bn" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
                            }`}
                        >
                            বাংলা
                        </button>
                    </div>

                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold shrink-0">
                                {session.user.name?.[0]?.toUpperCase() ?? "U"}
                            </Link>
                            <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => authClient.signOut()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" size="sm" className="whitespace-nowrap">{t("nav.login")}</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" size="sm" className="whitespace-nowrap">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>

                <button className="lg:hidden shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <div className="w-6 h-0.5 bg-neutral-900 mb-1.5" />
                    <div className="w-6 h-0.5 bg-neutral-900 mb-1.5" />
                    <div className="w-6 h-0.5 bg-neutral-900" />
                </button>
            </div>

            {menuOpen && (
                <div className="lg:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-neutral-500 font-medium">Language:</span>
                        <button
                            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                            className="text-xs font-bold text-primary border border-primary/30 px-2 py-1 rounded-md"
                        >
                            {language === "en" ? "Switch to বাংলা" : "Switch to English"}
                        </button>
                    </div>
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-600" onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn ? (
                        <Button variant="outline" size="sm" onClick={() => authClient.signOut()}>Logout</Button>
                    ) : (
                        <>
                            <Link href="/login"><Button variant="outline" size="sm" className="w-full">{t("nav.login")}</Button></Link>
                            <Link href="/register"><Button variant="primary" size="sm" className="w-full">Sign Up</Button></Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}