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
import { Edit, Package, Trash2 } from "lucide-react";
import { Suspense, use, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { ProductRequirementsDialog } from "../products/ProductRequirementsDialog";

let productsPromise: Promise<Product[]> | null = null;

function getProductsPromise() {
  if (!productsPromise) {
    productsPromise = store.dispatch(fetchProducts()).unwrap();
  }
  return productsPromise;
}

function ProductsTableContent() {
  const products = use(getProductsPromise());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <Button
                size="icon"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDialogOpen(true);
                }}
                title="View Requirements"
              >
                <Package className="h-4 w-4" />
              </Button>
              <Button size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" className="hover:text-red-600">
                <Trash2 className="h-4 w-4 transition-colors duration-200" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
      <ProductRequirementsDialog
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
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
        <Button className="text-white">New Product</Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
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
