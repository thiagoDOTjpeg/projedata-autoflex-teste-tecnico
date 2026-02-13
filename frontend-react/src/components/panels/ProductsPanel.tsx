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
import { deleteProduct, fetchProducts } from "@/store/features/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Product } from "@/types/product";
import { Edit, Package, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductEditDialog } from "../products/ProductEditDialog";
import { ProductMaterialsDialog } from "../products/ProductMaterialsDialog";

export function ProductsPanel() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

   const handleDelete = async (productId: string) => {
        await dispatch(deleteProduct(productId))
    };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading && products.length === 0) {
    return <ProductsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 border rounded-md bg-red-50">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="text-white bg-emerald-600 hover:bg-emerald-700">New Product</Button>
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
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditDetailsOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button  size="icon" className="hover:text-red-600" onClick={() => handleDelete(product.id)}  >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductMaterialsDialog
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <ProductEditDialog
        product={selectedProduct}
        open={isEditDetailsOpen}
        onOpenChange={setIsEditDetailsOpen}
      />
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Skeleton className="h-10 w-32" /></div>
      <div className="rounded-md border bg-white p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between py-4 border-b">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}