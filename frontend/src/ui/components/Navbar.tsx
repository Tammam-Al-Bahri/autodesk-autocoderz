import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, User, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { pagesLinks } from "@/pages";
import { useManagerView } from "@/context/ManagerViewContext";
import ManagerGuide from "@/pages/Managerguide";

export type NavbarView = "Guest" | "Staff" | "Manager";

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { enabled: managerViewEnabled } = useManagerView();

    const [currentView, setCurrentView] = useState<NavbarView>(() => {
        const savedView = localStorage.getItem("selectedView");
        if (!user) {
            return "Guest";
        }

        if (savedView === "Guest" || savedView === "Staff" || savedView === "Manager") {
            return savedView as NavbarView;
        }
        return "Staff";
    });

    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (!managerViewEnabled && currentView === "Manager") {
            setCurrentView("Staff");
            localStorage.setItem("selectedView", "Staff");
        }
    }, [managerViewEnabled, currentView]);

    useEffect(() => {
        if (!user) {
            setCurrentView("Guest");
            return;
        }
        const savedView = localStorage.getItem("selectedView");
        if (savedView === "Guest" || savedView === "Staff" || savedView === "Manager") {
            setCurrentView(savedView as NavbarView);
        } else {
            setCurrentView("Manager");
            localStorage.setItem("selectedView", "Manager");
        }
    }, [user]);

    const navLinks = pagesLinks.filter((link) =>
        link.navbarView?.includes(user ? currentView : "Guest"),
    );

    const views: { title: string; value: NavbarView }[] = [
        { title: "Staff", value: "Staff" },
        { title: "Manager", value: "Manager" },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="border-b-2 relative flex items-center px-4 py-2 z-10 select-none bg-background">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden mr-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <div className="border-r-2 pr-2">
                        <Logo />
                    </div>
                    {user && managerViewEnabled ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="font-semibold italic flex items-center gap-1 hover:opacity-80 transition-opacity outline-none">
                                    {currentView} view
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {views.map((view) => (
                                    <DropdownMenuItem
                                        key={view.value}
                                        className="justify-center font-medium cursor-pointer"
                                        onClick={() => {
                                            setCurrentView(view.value);
                                            localStorage.setItem("selectedView", view.value);

                                            if (view.value === "Staff") {
                                                navigate("/jobs", { replace: true });
                                            } else if (view.value === "Manager") {
                                                navigate("/dashboard", { replace: true });
                                            }
                                        }}
                                    >
                                        {view.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>

                {/* Central Navigation Links */}
                <div className="absolute left-1/2 top-0 hidden md:flex h-full -translate-x-1/2 items-center gap-2">
                    {navLinks.map((link) => (
                        <Button key={link.path} variant="ghost" asChild className="font-bold">
                            <Link to={link.path}>{link.title}</Link>
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-4 ml-auto z-10">
                    {currentView === "Manager" && (
                        <Button variant="outline" onClick={() => setShowGuide(true)}>
                            Manager Guide
                        </Button>
                    )}

                    {user ? (
                        <Button asChild variant="outline" size="icon">
                            <Link to="/profile">
                                <User className="w-5 h-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline">
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                    <ThemeToggle />
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full border-b bg-background flex flex-col items-center gap-2 py-4 md:hidden shadow-lg animate-in slide-in-from-top duration-300">
                        {navLinks.map((link) => (
                            <Button
                                key={link.path}
                                variant="ghost"
                                asChild
                                className="w-full font-bold"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link to={link.path}>{link.title}</Link>
                            </Button>
                        ))}
                        {/* Added mobile Guide button */}
                        {currentView === "Manager" && (
                            <Button
                                variant="ghost"
                                className="w-full font-bold"
                                onClick={() => {
                                    setShowGuide(true);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Manager Guide
                            </Button>
                        )}
                    </div>
                )}
            </nav>

            {showGuide && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl relative border shadow-lg">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background"
                            onClick={() => setShowGuide(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <ManagerGuide />
                    </div>
                </div>
            )}
        </>
    );
}