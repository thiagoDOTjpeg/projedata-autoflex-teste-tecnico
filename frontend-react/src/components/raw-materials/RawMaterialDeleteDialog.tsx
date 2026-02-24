import { ApiError } from "@/lib/api-errors";
import { deleteRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { RawMaterial } from "@/types/product";
import { toast } from "sonner";
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
      try {
        await dispatch(deleteRawMaterial(material.id)).unwrap();
        toast.success("Raw material deleted successfully!");
        onClose();
      } catch (error) {
        if (error instanceof ApiError && error.problemDetail) {
          toast.error(error.problemDetail.title || "Deletion Error", {
            description: error.problemDetail.detail,
          });
        } else {
          toast.error("Failed to delete raw material");
        }
        console.error("Failed to delete raw material:", error);
      }
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
            <Button className="w-full sm:w-auto" onClick={onClose} variant={"outline"}>Cancel</Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button className="w-full sm:w-auto" variant={"destructive"} onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
