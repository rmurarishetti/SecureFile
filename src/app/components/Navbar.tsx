// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import AuthButtons from "./AuthButtons";

const navLinks = [
    { title: "Products", id: "products" },
    { title: "Solutions", id: "solutions" },
    { title: "Resources", id: "resources" },
    { title: "Enterprise", id: "enterprise" },
    { title: "Docs", id: "docs" },
    { title: "Pricing", id: "pricing" },
];

const Navbar = () => {
    const currentRoute = usePathname();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-gray-800">
            <nav className="max-w-[1200px] mx-auto flex items-center justify-between p-4">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center">
                        <Logo />
                    </Link>

                    <ul className="hidden md:flex items-center space-x-6">
                        {navLinks.map((nav) => (
                            <li key={nav.id}>
                                <Link
                                    href={`/${nav.id}`}
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {nav.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center space-x-4">
                    <AuthButtons />
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-gray-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-300" />
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;