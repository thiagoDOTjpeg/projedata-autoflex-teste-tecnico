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
import { deleteProductMaterials, fetchProducts, updateProductMaterials } from "@/store/features/productsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Product, ProductMaterial } from "@/types/product";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ProductMaterialsDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductMaterialsDialog({
  product,
  open,
  onOpenChange,
}: ProductMaterialsDialogProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMaterials, setEditedMaterials] = useState<ProductMaterial[]>([]);

  useEffect(() => {
    if (product?.materials) {
      setEditedMaterials([...product.materials]);
    } else {
      setEditedMaterials([]);
    }
  }, [product, product?.materials]);

  if (!product) return null;

  const handleEdit = () => {
    setIsEditing(true);
    if (product.materials) {
      setEditedMaterials([...product.materials]);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (product.materials) {
      setEditedMaterials([...product.materials]);
    }
  };

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setEditedMaterials((prev) =>
      prev.map((material) =>
        material.rawMaterial.id === materialId
          ? { ...material, requiredQuantity: quantity }
          : material
      )
    );
  };

  const handleDelete = async (materialId: string) => {
    if (isEditing) {
      setEditedMaterials((prev) => prev.filter((m) => m.rawMaterial.id !== materialId));
    } else {
      try {
        setEditedMaterials((prev) => prev.filter((m) => m.rawMaterial.id !== materialId));
        
        await dispatch(deleteProductMaterials({ productId: product.id, materialId })).unwrap();
        await dispatch(fetchProducts());
      } catch (error) {
        console.error("Failed to delete product material:", error);
      }
    }
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
    <Dialog 
      open={open} 
      onOpenChange={(value) => { 
        onOpenChange(value); 
        if (!value) setIsEditing(false); 
      }} 
    >
      <DialogContent className="max-h-[85vh] min-w-[650px] flex flex-col" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Manufacturing Requirements: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold">Material</TableHead>
                <TableHead className="text-right font-bold">Quantity Required</TableHead>
                <TableHead className="text-right font-bold w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedMaterials.length > 0 ? (
                editedMaterials.map((material) => (
                  <TableRow key={material.rawMaterial.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">{material.rawMaterial.name}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end">
                           <Input
                            type="number"
                            min="0"
                            step="1"
                            className="w-24 text-right focus:ring-emerald-500"
                            value={material.requiredQuantity}
                            onChange={(e) => handleQuantityChange(material.rawMaterial.id, Number(e.target.value))}
                          />
                        </div>
                       ) : (
                        <span className="font-mono">{material.requiredQuantity}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="icon" 
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(material.rawMaterial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-muted-foreground italic"
                  >
                    No materials required for this product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex flex-row gap-2 border-t pt-4">
          <DialogClose asChild>
            <Button onClick={handleCancel}>Close</Button>
          </DialogClose>
          
          <div className="flex-1" />

          {isEditing ? (  
            <>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]" 
                onClick={handleSave}
              >
                Confirm
              </Button>
              <Button className="text-red-500 hover:bg-red-50" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button className="bg-slate-800 hover:bg-slate-900 text-white min-w-[100px]" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}