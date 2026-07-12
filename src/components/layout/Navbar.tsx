"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/Button";

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = !!session;
    const role = session?.user?.role;

    const loggedOutLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const loggedInLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        ...(role !== "Tenant" ? [{ href: "/missions/add", label: "Add Mission" }] : []),
        ...(role !== "Tenant" ? [{ href: "/missions/manage", label: "Manage" }] : []),
    ];

    const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <span>🛟</span> RescueLink
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-600 hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold">
                                {session.user.name?.[0]?.toUpperCase() ?? "U"}
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => authClient.signOut()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" size="sm">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>

                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <div className="w-6 h-0.5 bg-neutral-900 mb-1.5" />
                    <div className="w-6 h-0.5 bg-neutral-900 mb-1.5" />
                    <div className="w-6 h-0.5 bg-neutral-900" />
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-600" onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn ? (
                        <Button variant="outline" size="sm" onClick={() => authClient.signOut()}>Logout</Button>
                    ) : (
                        <>
                            <Link href="/login"><Button variant="outline" size="sm" className="w-full">Login</Button></Link>
                            <Link href="/register"><Button variant="primary" size="sm" className="w-full">Sign Up</Button></Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}