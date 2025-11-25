import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sprout, Home, LayoutDashboard, TrendingUp, MapPin, ScrollText, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { LanguageSelector, ThemeToggle } from "./LanguageAndTheme";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../lib/translations";

const Navbar = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  const navLinks = [
    { path: "/", label: getTranslation("home", language), icon: Home },
    { path: "/dashboard", label: getTranslation("dashboard", language), icon: LayoutDashboard },
    { path: "/detection", label: getTranslation("diseaseDetection", language), icon: Sprout },
    { path: "/prices", label: getTranslation("marketPrices", language), icon: TrendingUp },
    { path: "/services", label: getTranslation("services", language), icon: MapPin },
    { path: "/schemes", label: getTranslation("schemes", language), icon: ScrollText },
  ];

  const NavContent = () => (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link key={link.path} to={link.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">🍎 Fruit Vision AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavContent />
          <div className="flex items-center gap-1 ml-4 border-l pl-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-2 mt-8">
              <NavContent />
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
