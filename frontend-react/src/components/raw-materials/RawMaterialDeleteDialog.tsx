import { deleteRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { RawMaterial } from "@/types/product";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface RawMaterialDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  material: RawMaterial | null;
}

export function RawMaterialDeleteDialog({ isOpen, onClose, material }: RawMaterialDeleteDialogProps) {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (material?.id) {
      await dispatch(deleteRawMaterial(material.id));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Raw Material</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the raw material "{material?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 mt-6">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" onClick={onClose}>Cancel</Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button className="w-full sm:w-auto" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
