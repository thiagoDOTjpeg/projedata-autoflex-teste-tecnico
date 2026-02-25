import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productCreateSchema as formSchema, type ProductCreateFormValues as FormValues } from "@/schemas/product";
import { createProduct } from "@/store/features/productsSlice";
import { fetchRawMaterials } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ProductRequest } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProductCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductCreateDialog({
  open,
  onOpenChange,
}: ProductCreateDialogProps) {
  const dispatch = useAppDispatch();
  const { rawMaterials } = useAppSelector((state) => state.rawMaterials);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      materials: [],
    },
  });

  const { materials } = form.watch();

  const [selectedRawMaterialSelect, setSelectedRawMaterialSelect] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");

  useEffect(() => {
    if (open) {
      dispatch(fetchRawMaterials());
    }
  }, [open, dispatch]);

  const resetDialog = () => {
    form.reset();
    setSelectedRawMaterialSelect("");
    setSelectedQuantity("");
  };

  const handleAddMaterial = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedRawMaterialSelect || !selectedQuantity) return;
    
    const material = rawMaterials.find((m) => String(m.id) === String(selectedRawMaterialSelect));
    if (!material) return;

    if (materials.some((m) => String(m.materialId) === String(material.id))) return;

    form.setValue("materials", [
      ...materials,
      {
        materialId: String(material.id),
        name: material.name,
        quantity: Number(selectedQuantity),
      },
    ], { shouldValidate: true });
    setSelectedRawMaterialSelect("");
    setSelectedQuantity("");
  };

  const handleRemoveMaterial = (materialId: string | number) => {
    form.setValue(
      "materials",
      materials.filter((m) => String(m.materialId) !== String(materialId)),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: FormValues) => {
    const payload: ProductRequest = {
      name: values.name,
      price: values.price,
      materials: values.materials.map((m) => ({
        materialId: m.materialId,
        quantity: m.quantity,
      })),
    };

    try {
      await dispatch(createProduct(payload)).unwrap();
      onOpenChange(false);
      resetDialog();
      toast.success("Product created successfully!");
    } catch (error: any) {
     if (error && error.status === 400 && error.problemDetail) {
      
      error.problemDetail.errors?.forEach((err: { field: string, message: string }) => {
        const fieldName = err.field.split('.').pop() as any;

        form.setError(fieldName, { 
          type: "server", 
          message: err.message 
        });
      });
      } else {
        toast.error("Failed to create product");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) resetDialog();
    }}>
      <DialogContent className="max-h-[85vh] w-[95vw] max-w-[650px] flex flex-col" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Create New Product
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-hide py-4 space-y-6 flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="materials"
              render={() => (
                <FormItem className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">Raw Materials</h3>
                    <FormMessage />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 p-4 rounded-md border bg-slate-50">
                    <div className="flex-1 space-y-2 w-full">
                      <Label htmlFor="material">Select Material</Label>
                      <select
                        id="material"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedRawMaterialSelect}
                        onChange={(e) => setSelectedRawMaterialSelect(e.target.value)}
                      >
                        <option value="" disabled>Choose a material...</option>
                        {rawMaterials.map((material) => (
                          <option
                            key={material.id}
                            value={material.id}
                            disabled={materials.some((m) => String(m.materialId) === String(material.id))}
                          >
                            {material.name} (Stock: {material.stockQuantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-32 space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <Button 
                      onClick={handleAddMaterial}
                      disabled={!selectedRawMaterialSelect || !selectedQuantity || Number(selectedQuantity) <= 0}
                      className="bg-slate-800 hover:bg-slate-900 text-white w-full sm:w-auto h-10 mt-2 sm:mt-0"
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-bold">Material</TableHead>
                        <TableHead className="text-right font-bold">Quantity Required</TableHead>
                        <TableHead className="text-right font-bold w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.length > 0 ? (
                        materials.map((material) => (
                          <TableRow key={material.materialId} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium">{material.name}</TableCell>
                            <TableCell className="text-right font-mono">{material.quantity}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="icon"
                              
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => handleRemoveMaterial(material.materialId)}
                                type="button"
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
                            className="h-24 text-center text-muted-foreground italic"
                          >
                            No materials added yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex flex-row gap-4 border-t pt-4 mt-auto">
              <DialogClose asChild>
                <Button type="button" onClick={() => resetDialog()}>Cancel</Button>
              </DialogClose>
              <div className="flex-1" />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-32"
                disabled={form.formState.isSubmitting}
              >
                Create Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
