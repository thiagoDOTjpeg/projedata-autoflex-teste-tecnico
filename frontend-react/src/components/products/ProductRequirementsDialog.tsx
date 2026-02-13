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
import { updateProductMaterials } from "@/store/features/productsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Product, ProductMaterial } from "@/types/product";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMaterials, setEditedMaterials] = useState<ProductMaterial[]>([]);

  useEffect(() => {
    if (product) {
      setEditedMaterials(product.materials);
    }
  }, [product]);

  if (!product) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedMaterials(product.materials);
  }

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMaterials(product.materials);
  }

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setEditedMaterials((prev) =>
      prev.map((material) =>
        material.rawMaterial.id === materialId
          ? { ...material, requiredQuantity: quantity }
          : material
      )
    );
  };

  const handleSave = async () => {
    const payload = {
      materials: editedMaterials.map((m) => ({
        materialId: m.rawMaterial.id,
        quantity: Number(m.requiredQuantity),
      })),
    };
    
    try {
      await dispatch(updateProductMaterials({ productId: product.id, payload })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product materials:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); setIsEditing(false); }} >
      <DialogContent className="h-[calc(100vh-55rem)] min-w-[600px]" showCloseButton={false}>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedMaterials?.length > 0 ? (
                editedMaterials.map((material) => (
                  <TableRow key={material.rawMaterial.id}>
                    <TableCell>{material.rawMaterial.name}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end">
                           <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 text-right"
                            value={material.requiredQuantity}
                            onChange={(e) => handleQuantityChange(material.rawMaterial.id, parseFloat(e.target.value))}
                          />
                        </div>
                       ) : (
                        material.requiredQuantity
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" className="hover:text-red-600">
                        <Trash2 className="h-4 w-4 transition-colors duration-200" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
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
            <Button className="hover:text-red-500" onClick={handleCancel}>Close</Button>
          </DialogClose>
          {isEditing ? (  
            <>
              <Button className="hover:text-green-500" onClick={handleSave}>Confirm</Button>
              <Button className="hover:text-red-500" onClick={handleCancel}>Cancel</Button>
            </>
          ) : (
            <Button className="hover:text-green-500" onClick={handleEdit} >Edit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
