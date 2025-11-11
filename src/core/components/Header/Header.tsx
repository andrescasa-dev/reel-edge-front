"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/core/utils";
import { Button } from "@/core/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface HeaderProps {
  menuItems: MenuItem[];
  logo?: React.ReactNode;
  title?: string;
}

export function Header({ menuItems, logo, title = "Casino Research Assistant" }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          {logo || (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-4 w-4 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

