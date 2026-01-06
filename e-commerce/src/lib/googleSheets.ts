export interface Product {
  product_id: number;
  sku: string;
  codigo_oem: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  marca: string;
  modelo_compatible: string;
  anio_desde: number;
  anio_hasta: number;
  ubicacion_bodega: string;
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
  precio_compra_clp: number;
  precio_venta_clp: number;
  iva_incluido: boolean;
  proveedor_principal: string;
  estado_producto: string;
  fecha_ultima_compra: string;
  ultima_actualizacion: string;
  img_principal_url: string;
  img_zoom_url: string;
  img_icono_url: string;
  img_thumbnail_url: string;
  img_galeria_1_url: string;
}

const SHEET_ID = "1Znbuniwm_hzwtgMxjRNK5-Rk6k-BJfL2qdKLYacChsE";
const GID = "151725806";
const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, "").trim());
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.replace(/"/g, "").trim() || "";
    });
    
    data.push(row);
  }
  
  return data;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(SHEETS_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rawData = parseCSV(csvText);
    
    return rawData.map((row): Product => ({
      product_id: parseInt(row.product_id) || 0,
      sku: row.sku || "No disponible",
      codigo_oem: row.codigo_oem || "No disponible",
      nombre: row.nombre || "Sin nombre",
      categoria: row.categoria || "Sin categoría",
      subcategoria: row.subcategoria || "No disponible",
      marca: row.marca || "No disponible",
      modelo_compatible: row.modelo_compatible || "No disponible",
      anio_desde: parseInt(row.anio_desde) || 0,
      anio_hasta: parseInt(row.anio_hasta) || 0,
      ubicacion_bodega: row.ubicacion_bodega || "No disponible",
      unidad_medida: row.unidad_medida || "unidad",
      stock_actual: parseInt(row.stock_actual) || 0,
      stock_minimo: parseInt(row.stock_minimo) || 0,
      precio_compra_clp: parseInt(row.precio_compra_clp) || 0,
      precio_venta_clp: parseInt(row.precio_venta_clp) || 0,
      iva_incluido: row.iva_incluido === "✔" || row.iva_incluido === "true",
      proveedor_principal: row.proveedor_principal || "No disponible",
      estado_producto: row.estado_producto || "No disponible",
      fecha_ultima_compra: row.fecha_ultima_compra || "No disponible",
      ultima_actualizacion: row.ultima_actualizacion || "No disponible",
      img_principal_url: row.img_principal_url || "",
      img_zoom_url: row.img_zoom_url || "",
      img_icono_url: row.img_icono_url || "",
      img_thumbnail_url: row.img_thumbnail_url || "",
      img_galeria_1_url: row.img_galeria_1_url || "",
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getStockStatus(stock: number, minStock: number): "available" | "low" | "out" {
  if (stock === 0) return "out";
  if (stock <= minStock) return "low";
  return "available";
}

export function getStockLabel(status: "available" | "low" | "out"): string {
  switch (status) {
    case "available": return "En stock";
    case "low": return "Últimas unidades";
    case "out": return "Agotado";
  }
}
