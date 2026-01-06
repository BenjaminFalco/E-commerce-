import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Catalog() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const categories = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.modelo_compatible.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.codigo_oem.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-2 text-accent mb-2 animate-fade-in">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Conectado a Google Sheets</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Catálogo de Repuestos
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            Explora nuestro inventario completo de autopartes. 
            Todos los productos se cargan en tiempo real desde Excel.
          </p>
          {products && (
            <div className="flex items-center gap-4 mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="bg-primary-foreground/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-accent">{products.length}</span>
                <span className="text-sm text-primary-foreground/70 ml-2">productos</span>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-accent">{categories.length}</span>
                <span className="text-sm text-primary-foreground/70 ml-2">categorías</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="container flex-1 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Error al cargar los productos desde Google Sheets</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Results Count */}
        {!isLoading && products && (
          <p className="text-sm text-muted-foreground mb-4">
            Mostrando {filteredProducts.length} de {products.length} productos
            {selectedCategory && ` en ${selectedCategory}`}
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        )}

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}
