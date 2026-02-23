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
import { Label } from "@/components/ui/label";
import { createRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";

interface RawMaterialCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RawMaterialCreateDialog({
  open,
  onOpenChange,
}: RawMaterialCreateDialogProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");

  const handleCreate = async () => {
    if (!name || stockQuantity === "") return;

    await dispatch(createRawMaterial({
      name,
      stockQuantity: Number(stockQuantity),
    }));
    
    setName("");
    setStockQuantity("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setName("");
    setStockQuantity("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create New Raw Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="text-left sm:text-right">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Iron Ore"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-1 sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="stock" className="text-left sm:text-right">Stock</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value ? parseFloat(e.target.value) : "")}
              className="col-span-1 sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 mt-6">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" onClick={handleClose}>Cancel</Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" 
            onClick={handleCreate} 
            disabled={!name || stockQuantity === ""}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
