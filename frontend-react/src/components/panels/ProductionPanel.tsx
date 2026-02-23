import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProductionSuggestions } from "@/store/features/productionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export function ProductionPanel() {
  const dispatch = useAppDispatch();
  const { suggestions, loading, error } = useAppSelector((state) => state.production);

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  if (loading && suggestions.length === 0) {
    return <ProductionPanelSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 border rounded-md bg-red-50">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Max Production Quantity</TableHead>
              <TableHead className="text-right">Total Value</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{suggestion.productName}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-600">
                    {suggestion.quantityToProduce}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-600">
                    {suggestion.totalValue}
                  </TableCell>
                </TableRow> 
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-slate-500">
                  No production suggestions available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductionPanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between py-4 border-b">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
