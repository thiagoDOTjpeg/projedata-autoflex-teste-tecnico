import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProducts } from "@/store/features/productsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function ProductsPanel() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading products...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
