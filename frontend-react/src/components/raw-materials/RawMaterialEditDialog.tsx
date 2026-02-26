import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  rawMaterialSchema,
  type RawMaterialFormValues,
} from "@/schemas/raw-material";
import { updateRawMaterial } from "@/store/features/rawMaterialsSlice";
import { useAppDispatch } from "@/store/hooks";
import type { RawMaterial } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface RawMaterialEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  material: RawMaterial | null;
}

export function RawMaterialEditDialog({
  isOpen,
  onOpenChange,
  material,
}: RawMaterialEditDialogProps) {
  const dispatch = useAppDispatch();

  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(rawMaterialSchema),
    defaultValues: {
      name: "",
      stockQuantity: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && material) {
      form.reset({
        name: material.name,
        stockQuantity: material.stockQuantity,
      });
    } else if (!isOpen) {
      form.reset();
    }
  }, [isOpen, material, form]);

  const handleSaveEdit = async (data: RawMaterialFormValues) => {
    if (!material) return;

    try {
      await dispatch(
        updateRawMaterial({
          id: material.id,
          name: data.name,
          stockQuantity: data.stockQuantity,
        }),
      ).unwrap();

      toast.success("Raw material updated successfully!");
      onOpenChange(false);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status: number }).status === 400 &&
        "problemDetail" in error
      ) {
        const problemDetail = (
          error as {
            problemDetail: {
              errors?: Array<{ field: string; message: string }>;
            };
          }
        ).problemDetail;
        problemDetail.errors?.forEach(
          (err: { field: string; message: string }) => {
            const fieldName = err.field
              .split(".")
              .pop() as keyof RawMaterialFormValues;
            form.setError(fieldName, {
              type: "server",
              message: err.message,
            });
          },
        );
      } else {
        toast.error("Failed to update raw material");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-106.25"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Edit Raw Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSaveEdit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 space-y-0">
                  <FormLabel className="text-left sm:text-right">
                    Name
                  </FormLabel>
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
                  <FormLabel className="text-left sm:text-right">
                    Stock
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        step="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
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
                <Button className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <div className="flex-1 hidden sm:block" />
              <Button
                type="submit"
                className="w-full sm:w-auto hover:bg-emerald-700 hover:text-white"
                disabled={form.formState.isSubmitting}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
