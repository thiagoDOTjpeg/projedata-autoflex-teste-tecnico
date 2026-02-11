import { Button } from "@/components/ui/button";

export function RawMaterialsPanel() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border bg-white border-dashed">
      <h3 className="text-lg font-medium text-slate-800">
        Raw Materials Panel
      </h3>
      <p className="text-slate-500 mb-4">
        Raw materials inventory management under development.
      </p>
      <Button variant="outline">Manage Inventory</Button>
    </div>
  );
}
