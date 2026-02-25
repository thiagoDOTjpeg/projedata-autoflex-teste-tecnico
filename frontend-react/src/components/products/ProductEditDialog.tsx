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
import { productEditSchema, type ProductEditFormValues } from "@/schemas/product";
import { updateProduct } from "@/store/features/productsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

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

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: { name: "", price: undefined },
  });

  useEffect(() => {
    if (open && product) {
      form.reset({
        name: product.name,
        price: product.price,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, product, form]);

  const handleSave = async (data: ProductEditFormValues) => {
    if (!product) return;

    try {
      await dispatch(
        updateProduct({
          productId: product.id,
          payload: {
            name: data.name,
            price: data.price,
          },
        })
      ).unwrap();
      toast.success("Product updated successfully");  
      onOpenChange(false);
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
        toast.error("Failed to update product");
      }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-4">
            <FormField  
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 space-y-0">
                  <FormLabel className="text-left sm:text-right">Name</FormLabel>
                  <div className="col-span-1 sm:col-span-3">
                    <FormControl>
                      <Input placeholder="e.g. Iron Ore" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 space-y-0">
                  <FormLabel className="text-left sm:text-right">Price</FormLabel>
                  <div className="col-span-1 sm:col-span-3">
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </div>
                </FormItem>
              )}
            />
         
          
        <DialogFooter className="flex sm:flex-row flex-col gap-2 sm:gap-4 border-t pt-4 mt-4">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
          <div className="flex-1 hidden sm:block" />
          <Button 
          type="submit"
          className="w-full sm:w-auto"
          disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
        </DialogFooter>
         </form> 
        </Form>
      </DialogContent>
    </Dialog>
  );
}
