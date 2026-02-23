import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/store/features/productsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductEditDialog({
  product,
  open,
  onOpenChange,
}: ProductEditDialogProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;

    try {
      await dispatch(
        updateProduct({
          productId: product.id,
          payload: {
            name,
            price: parseFloat(price),
          },
        })
      ).unwrap();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="text-left sm:text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-1 sm:col-span-3" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="price" className="text-left sm:text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-1 sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex sm:flex-row flex-col gap-2 sm:gap-4 border-t pt-4 mt-4">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button onClick={handleSave} className="w-full sm:w-auto">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
