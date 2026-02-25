import { fetchRawMaterials } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RawMaterial } from "@/types/product";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RawMaterialCreateDialog } from "../raw-materials/RawMaterialCreateDialog";
import { RawMaterialDeleteDialog } from "../raw-materials/RawMaterialDeleteDialog";
import { RawMaterialEditDialog } from "../raw-materials/RawMaterialEditDialog";
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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  const handleEditClick = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setIsDeleteOpen(true);
  };

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
        <Button 
          className="text-white bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setIsCreateOpen(true)}
        >
          New Raw Material
        </Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm overflow-x-auto scrollbar-hide">
        <Table className="min-w-[500px]">
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
                    <Button size="icon" onClick={() => handleEditClick(rm)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="hover:text-red-600" onClick={() => handleDeleteClick(rm)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 transition-colors duration-200" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RawMaterialEditDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        material={selectedMaterial}
      />

      <RawMaterialDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        material={selectedMaterial}
      />

      <RawMaterialCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}


function RawMaterialsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
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
