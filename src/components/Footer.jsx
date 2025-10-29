export default function Footer() {
    return (
        <div>
            <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-background"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 2C6.48 2 2 6.48 
                    2 12s4.48 10 10 10 
                    10-4.48 10-10S17.52 2 12 2z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-bold">WeConnect</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Empowering learners worldwide through live
                                tutoring
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 WeConnect. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                Twitter
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
