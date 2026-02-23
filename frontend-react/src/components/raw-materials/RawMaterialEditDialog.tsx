import { updateRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { RawMaterial } from "@/types/product";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RawMaterialEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  material: RawMaterial | null;
}

export function RawMaterialEditDialog({ isOpen, onClose, material }: RawMaterialEditDialogProps) {
  const dispatch = useAppDispatch();
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  useEffect(() => {
    setEditingMaterial(material);
  }, [material]);

  const handleSaveEdit = async () => {
    if (editingMaterial) {
      await dispatch(updateRawMaterial(editingMaterial));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Raw Material</DialogTitle>
        </DialogHeader>
        {editingMaterial && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="name" className="text-left sm:text-right">Name</Label>
              <Input
                id="name"
                value={editingMaterial.name}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                className="col-span-1 sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="stock" className="text-left sm:text-right">Stock</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                value={editingMaterial.stockQuantity}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, stockQuantity: parseFloat(e.target.value) || 0 })}
                className="col-span-1 sm:col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 mt-6">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          </DialogClose>
          
          <div className="flex-1 hidden sm:block" />
          <Button className="w-full sm:w-auto" onClick={handleSaveEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
