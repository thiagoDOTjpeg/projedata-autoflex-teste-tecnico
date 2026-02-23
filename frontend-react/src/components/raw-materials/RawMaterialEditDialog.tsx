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
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Raw Material</DialogTitle>
        </DialogHeader>
        {editingMaterial && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={editingMaterial.name}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input
                id="stock"
                type="number"
                step="0.01"
                value={editingMaterial.stockQuantity}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, stockQuantity: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-row gap-2 border-t pt-4">
          <DialogClose asChild>
            <Button onClick={onClose}>Cancel</Button>
          </DialogClose>
          
          <div className="flex-1" />
          <Button onClick={handleSaveEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
