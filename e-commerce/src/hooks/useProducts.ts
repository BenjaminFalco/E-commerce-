import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product } from "@/lib/googleSheets";

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useProduct(productId: number) {
  const { data: products, isLoading, error } = useProducts();
  
  const product = products?.find(p => p.product_id === productId);
  
  return {
    product,
    isLoading,
    error,
  };
}

export function useCategories() {
  const { data: products } = useProducts();
  
  if (!products) return [];
  
  const categories = [...new Set(products.map(p => p.categoria))].filter(Boolean);
  return categories.sort();
}
