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
import { ApiError } from "@/lib/api-errors";
import { rawMaterialSchema, type RawMaterialFormValues } from "@/schemas/raw-material";
import { createRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RawMaterialCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RawMaterialCreateDialog({
  open,
  onOpenChange,
}: RawMaterialCreateDialogProps) {
  const dispatch = useAppDispatch();

  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    defaultValues: {
      name: "",
      stockQuantity: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        stockQuantity: undefined,
      });
    }
  }, [open, form]);

  const onSubmit = async (data: RawMaterialFormValues) => {
    try {
      await dispatch(createRawMaterial({
        name: data.name,
        stockQuantity: data.stockQuantity,
      })).unwrap();
      
      toast.success("Raw material created successfully!");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.problemDetail) {
        toast.error(error.problemDetail.title || "Validation Error", {
          description: error.problemDetail.detail,
        });
        error.problemDetail.errors?.forEach((err) => {
          form.setError(err.field as any, { type: "server", message: err.message });
          toast.error(`Field '${err.field}': ${err.message}`);
        });
      } else {
        toast.error("Failed to create raw material");
      }
      console.error("Failed to create raw material:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create New Raw Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
              name="stockQuantity"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 space-y-0">
                  <FormLabel className="text-left sm:text-right">Stock</FormLabel>
                  <div className="col-span-1 sm:col-span-3">
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        step="1"
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

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t pt-4 mt-6">
              <DialogClose asChild>
                <Button type="button" className="w-full sm:w-auto" onClick={handleClose}>Cancel</Button>
              </DialogClose>
              <div className="flex-1 hidden sm:block" />
              <Button 
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" 
                disabled={form.formState.isSubmitting}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
