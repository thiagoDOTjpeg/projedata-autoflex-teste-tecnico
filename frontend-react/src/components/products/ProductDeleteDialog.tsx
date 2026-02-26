import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/store/features/productsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Product } from "@/types/product";
import { toast } from "sonner";

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
}: ProductDeleteDialogProps) {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (product?.id) {
      await dispatch(deleteProduct(product.id));
      toast.success("Product deleted successfully");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-106.25"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product "{product?.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 mt-6">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button className="w-full sm:w-auto" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
