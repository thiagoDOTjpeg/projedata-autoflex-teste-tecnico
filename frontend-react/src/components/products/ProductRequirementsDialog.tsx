import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ProductRequirementsDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductRequirementsDialog({
  product,
  open,
  onOpenChange,
}: ProductRequirementsDialogProps) {
  if (!product) return null;
  const [isEditing, setIsEditing] = useState(false);
  

  return (
    <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); setIsEditing(false); }} >
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            Manufacturing Requirements: {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantity Required</TableHead>
                {isEditing && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.materials?.length > 0 ? (
                product.materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{isEditing ? <Input value={material.rawMaterial.name} /> : material.rawMaterial.name }</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? <Input value={material.requiredQuantity} /> : material.requiredQuantity}
                    </TableCell>
                    {isEditing && <TableCell className="text-right">
                      <Button size="icon" className="hover:text-red-600">
                        <Trash2 className="h-4 w-4 transition-colors duration-200" />
                      </Button>
                    </TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No materials required for this product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild>
            <Button className="hover:text-red-500">Close</Button>
          </DialogClose>
          {isEditing ? (  
            <>
              <Button className="hover:text-green-500">Confirm</Button>
              <Button className="hover:text-red-500" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button className="hover:text-green-500" onClick={() => setIsEditing(true)} >Edit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
