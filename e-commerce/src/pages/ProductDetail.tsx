import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  FileText,
  Tag,
  Calendar,
  MapPin,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { formatPrice, getStockStatus, getStockLabel } from "@/lib/googleSheets";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(Number(id));

  const handleDemoAction = (action: string) => {
    toast.info(`Demo: ${action}`, {
      description: "Esta es una demostración. No se procesan transacciones reales.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="container flex-1 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="container flex-1 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El producto que buscas no existe o fue removido.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al catálogo
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock_actual, product.stock_minimo);
  const stockLabel = getStockLabel(stockStatus);

  const StockIcon = stockStatus === 'available' ? CheckCircle : 
                    stockStatus === 'low' ? AlertTriangle : XCircle;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="container flex-1 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
          <Link to="/" className="hover:text-accent transition-colors">Catálogo</Link>
          <span>/</span>
          <span>{product.categoria}</span>
          <span>/</span>
          <span className="text-foreground">{product.nombre}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="relative aspect-square bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <Package className="h-32 w-32 text-muted-foreground/20" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                  {product.categoria}
                </Badge>
                <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                  {product.subcategoria}
                </Badge>
              </div>
              
              <span className={`badge-stock absolute top-4 right-4 ${
                stockStatus === 'available' ? 'badge-stock-available' :
                stockStatus === 'low' ? 'badge-stock-low' : 'badge-stock-out'
              }`}>
                <StockIcon className="h-3 w-3 mr-1" />
                {stockLabel}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* Brand & SKU */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="font-medium">
                <Tag className="h-3 w-3 mr-1" />
                {product.marca}
              </Badge>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {product.nombre}
            </h1>

            {/* Compatible Model */}
            <p className="text-muted-foreground">
              Compatible con: <span className="text-foreground font-medium">{product.modelo_compatible}</span>
              {" "}({product.anio_desde} - {product.anio_hasta})
            </p>

            {/* Price */}
            <div className="bg-secondary/50 rounded-xl p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(product.precio_venta_clp)}
                </span>
                {product.iva_incluido && (
                  <Badge variant="secondary">IVA incluido</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Precio por {product.unidad_medida}
              </p>
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span><strong>{product.stock_actual}</strong> {product.unidad_medida}(s) disponible(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{product.ubicacion_bodega}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-gradient-accent hover:opacity-90 shadow-glow animate-pulse-glow"
                onClick={() => handleDemoAction("Agregar al carrito")}
                disabled={stockStatus === 'out'}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al carro
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="flex-1"
                onClick={() => handleDemoAction("Comprar ahora")}
                disabled={stockStatus === 'out'}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Comprar
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleDemoAction("Solicitar cotización")}
              >
                <FileText className="h-5 w-5 mr-2" />
                Cotizar
              </Button>
            </div>

            <Separator />

            {/* Technical Details */}
            <div>
              <h3 className="font-semibold mb-4">Detalles del producto</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Código OEM</dt>
                  <dd className="font-medium">{product.codigo_oem}</dd>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Marca</dt>
                  <dd className="font-medium">{product.marca}</dd>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Categoría</dt>
                  <dd className="font-medium">{product.categoria}</dd>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Subcategoría</dt>
                  <dd className="font-medium">{product.subcategoria}</dd>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Estado</dt>
                  <dd className="font-medium">{product.estado_producto}</dd>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <dt className="text-muted-foreground mb-1">Proveedor</dt>
                  <dd className="font-medium">{product.proveedor_principal}</dd>
                </div>
              </dl>
            </div>

            {/* Shipping Info (Demo) */}
            <div className="bg-success/5 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-success font-medium mb-2">
                <Truck className="h-5 w-5" />
                <span>Envío disponible a todo Chile</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Despacho en 24-48 horas hábiles (Demo)
              </p>
            </div>

            {/* Last Update */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Última actualización: {product.ultima_actualizacion}</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
