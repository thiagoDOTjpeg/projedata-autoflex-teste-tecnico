import { fetchRawMaterials } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";
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

export function RawMaterialsPanel() {
  const dispatch = useAppDispatch();
  const { rawMaterials, loading, error } = useAppSelector((state) => state.rawMaterials);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  if (loading && rawMaterials.length === 0) {
    return <RawMaterialsTableSkeleton />;
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
        <Button className="text-white bg-emerald-600 hover:bg-emerald-700">New Raw Material</Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock Quantity</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rawMaterials.map((rm) => (
              <TableRow key={rm.id}>
                <TableCell className="font-medium">{rm.name}</TableCell>
                <TableCell>{rm.stockQuantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
          </TableBody>
        </Table>
      </div>
    </div>
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
