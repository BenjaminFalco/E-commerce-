import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-bold text-xl">
                Auto<span className="text-accent">Parts</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Demo de eCommerce conectado a Google Sheets. 
              Catálogo de repuestos automotrices en tiempo real.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto (Demo)</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>demo@autoparts.cl</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <p className="text-sm text-primary-foreground/70">
              Este es un sitio de demostración. Los productos mostrados 
              se cargan directamente desde un archivo de Google Sheets.
              No se realizan transacciones reales.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© 2025 AutoParts Demo. Todos los datos provienen de Google Sheets.</p>
        </div>
      </div>
    </footer>
  );
}
