import { Link } from "react-router-dom";
import { Package, Tag } from "lucide-react";
import { Product, formatPrice, getStockStatus, getStockLabel } from "@/lib/googleSheets";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock_actual, product.stock_minimo);
  const stockLabel = getStockLabel(stockStatus);
  const placeholderImage = "/placeholder.svg";
  const thumbnailImage =
    product.img_thumbnail_url?.trim() ||
    product.img_principal_url?.trim() ||
    placeholderImage;
  const iconImage = product.img_icono_url?.trim();

  return (
    <Link
      to={`/producto/${product.product_id}`}
      className="product-card group block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-secondary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <img
          src={thumbnailImage}
          alt={product.nombre}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = placeholderImage;
          }}
        />
        <Package className="h-16 w-16 text-muted-foreground/30 transition-transform group-hover:scale-110 relative z-10" />
        
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm"
        >
          {product.categoria}
        </Badge>
        
        {/* Stock Badge */}
        <span className={`badge-stock absolute top-3 right-3 ${
          stockStatus === 'available' ? 'badge-stock-available' :
          stockStatus === 'low' ? 'badge-stock-low' : 'badge-stock-out'
        }`}>
          {stockLabel}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{product.marca}</span>
        </div>

        {/* Name */}
        <h3 className="flex items-center gap-2 font-semibold text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
          {iconImage && (
            <img
              src={iconImage}
              alt={`Icono de ${product.nombre}`}
              className="h-4 w-4 shrink-0"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          <span>{product.nombre}</span>
        </h3>

        {/* Compatible Model */}
        <p className="text-xs text-muted-foreground">
          {product.modelo_compatible} ({product.anio_desde}-{product.anio_hasta})
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.precio_venta_clp)}
          </span>
          {product.iva_incluido && (
            <span className="text-xs text-muted-foreground">IVA incl.</span>
          )}
        </div>

        {/* Stock Info */}
        <p className="text-xs text-muted-foreground">
          {product.stock_actual} {product.unidad_medida}(s) disponible(s)
        </p>
      </div>
    </Link>
  );
}
