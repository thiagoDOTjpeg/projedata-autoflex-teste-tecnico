import { fetchRawMaterials } from "@/store/features/rawMaterialsSlice";
import { store } from "@/store/store";
import type { RawMaterial } from "@/types/product";
import { Edit, Trash2 } from "lucide-react";
import { Suspense, use } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

let rawMaterialsPromise: Promise<RawMaterial[]> | null = null;

function getProductsPromise() {
  if (!rawMaterialsPromise) {
    rawMaterialsPromise = store.dispatch(fetchRawMaterials()).unwrap();
  }
  return rawMaterialsPromise;
}

function RawMaterialsTableContent() {
  const products = use(getProductsPromise());

  return (
    <>
      {products.map((rm) => (
        <TableRow key={rm.id}>
          <TableCell className="font-medium">{rm.name}</TableCell>
          <TableCell>{rm.stockQuantity}</TableCell>
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

function RawMaterialsTableSkeleton() {
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

export function RawMaterialsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          New Raw Material
        </Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock Quantity</TableHead>
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
              <Suspense fallback={<RawMaterialsTableSkeleton />}>
                <RawMaterialsTableContent />
              </Suspense>
            </ErrorBoundary>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
