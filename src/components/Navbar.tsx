"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "error came");
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { categories, isLoading, error } = useCategories();
  const { cartItems, cartItemsCount, isClient = false } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              NexStore
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/Main">Home</NavLink>
              <DropdownMenu
                title="Products"
                items={["all-products", "Featured", "New-Arrivals"]}
              />
              <DropdownMenu
                title="Categories"
                items={categories}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavIcon
              href="/Cart"
              icon={
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {isClient && cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              }
            />
          </div>
          <div className="md:hidden">
            <MobileMenu categories={categories} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
  >
    {children}
  </Link>
);

const NavIcon = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <Link href={href} className="text-gray-700 hover:text-gray-900">
    {icon}
  </Link>
);

const SearchBar = () => (
  <div className="relative">
    <Input
      type="text"
      placeholder="Search products..."
      className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
  </div>
);

const DropdownMenu = ({
  title,
  items,
  isLoading = false,
}: {
  title: string;
  items: string[];
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryLink = (category: string) => {
    const formattedCategory = category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/'/g, "")
      .replace(/&/g, "and");
    if (formattedCategory === "men's-clothing")
      return "/categories/mens-clothing";
    if (formattedCategory === "women's-clothing")
      return "/categories/womens-clothing";
    return `/categories/${formattedCategory}`;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
        {title}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-gray-700">
                  Loading...
                </div>
              ) : (
                items.map((item, index) => (
                  <Link
                    key={index}
                    href={getCategoryLink(item)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {item}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu = ({ categories }: { categories: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { cartItems, isClient } = useCart();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const getCategoryLink = (category: string) => {
    const formattedCategory = category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/'/g, "");
    return `/categories/${formattedCategory}`;
  };

  const menuSections = [
    { title: "Products", items: ["All Products", "Featured", "New Arrivals"] },
    { title: "Categories", items: categories },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <Link href="/" className="text-2xl font-bold text-gray-800 mb-4">
            NexStore
          </Link>
          <Link href="/Main">Home</Link>
          {menuSections.map((section) => (
            <div key={section.title} className="border-b border-gray-200 py-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex justify-between items-center w-full text-left text-gray-700 hover:text-gray-900 py-2"
              >
                {section.title}
                {expandedSection === section.title ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {expandedSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {section.items.map((item, index) => (
                      <Link
                        key={index}
                        href={getCategoryLink(item)}
                        className="block pl-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        {item}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link href="/Cart" className="flex items-center justify-between">
            <span>Cart</span>
            {isClient && cartItems.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItems.length}
              </span>
            )}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
