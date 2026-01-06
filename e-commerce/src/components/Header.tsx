import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to="/" className="text-lg font-medium hover:text-accent transition-colors">
                Catálogo
              </Link>
              <Link to="/" className="text-lg font-medium hover:text-accent transition-colors">
                Categorías
              </Link>
              <Link to="/" className="text-lg font-medium hover:text-accent transition-colors">
                Contacto
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-gradient-accent p-2 rounded-lg">
            <Wrench className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="hidden sm:inline">
            <span className="text-foreground">Auto</span>
            <span className="text-accent">Parts</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos, marcas, modelos..."
              className="pl-10 bg-secondary border-0"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
            Catálogo
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
            Categorías
          </Link>
        </nav>

        {/* Cart (Demo) */}
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
            0
          </span>
        </Button>
      </div>
    </header>
  );
}
