import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProducts } from "@/store/features/productsSlice";
import { store } from "@/store/store";
import type { Product } from "@/types/product";
import { Edit, Trash2 } from "lucide-react";
import { Suspense, use } from "react";
import ErrorBoundary from "../ErrorBoundary";

let productsPromise: Promise<Product[]> | null = null;

function getProductsPromise() {
  if (!productsPromise) {
    productsPromise = store.dispatch(fetchProducts()).unwrap();
  }
  return productsPromise;
}

function ProductsTableContent() {
  const products = use(getProductsPromise());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell className="font-medium">{product.name}</TableCell>
          <TableCell>{formatCurrency(product.price)}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button>
                <Edit className="h-4 w-4" />
              </Button>
              <Button className="hover:text-red-600">
                <Trash2 className="h-4 w-4 transition-colors duration-200" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function ProductsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-50" />
          </TableCell>
          <TableCell>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function ProductsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          New Product
        </Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-25 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ErrorBoundary
              fallback={
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-red-500"
                  >
                    Error: Occurred an error while getting the products!
                  </TableCell>
                </TableRow>
              }
            >
              <Suspense fallback={<ProductsTableSkeleton />}>
                <ProductsTableContent />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
