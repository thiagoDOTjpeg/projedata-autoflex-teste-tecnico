import { Button } from "@/components/ui/button";

export function ProductionPanel() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border bg-white border-dashed">
      <h3 className="text-lg font-medium text-slate-800">Production Panel</h3>
      <p className="text-slate-500 mb-4">
        Production line visualization under development.
      </p>
      <Button variant="outline">View Details</Button>
    </div>
  );
}
