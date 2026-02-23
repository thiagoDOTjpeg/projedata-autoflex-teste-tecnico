import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkSystemHealth, fetchWhoami } from "@/store/features/systemSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Boxes, Factory, Package } from "lucide-react";
import { useEffect } from "react";
import { ProductionPanel } from "./panels/ProductionPanel";
import { ProductsPanel } from "./panels/ProductsPanel";
import { RawMaterialsPanel } from "./panels/RawMaterialsPanel";

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { hostname, isHealthy } = useAppSelector((state) => state.system);

  useEffect(() => {
    dispatch(fetchWhoami());
    dispatch(checkSystemHealth());

    const intervalId = setInterval(() => {
      dispatch(checkSystemHealth());
    }, 30000); 

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="w-full min-h-dvh bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 md:px-6 py-4">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Factory className="h-5 w-5 md:h-6 md:w-6" />
          Inventory System
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-hidden">
        <Tabs defaultValue="products" className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 overflow-x-auto scrollbar-hide">
            <TabsList className="flex flex-col sm:flex-row gap-2 md:gap-4 border w-full sm:w-auto h-auto">
              <TabsTrigger
                value="production"
                className="data-[state=active]:text-white bg-white text-slate-400 hover:text-slate-400 w-full sm:w-auto"
              >
                <Factory className="mr-2 h-4 w-4" />
                Production
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:text-white text-slate-400 hover:text-slate-400 w-full sm:w-auto"
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:text-white text-slate-400 hover:text-slate-400 w-full sm:w-auto"
              >
                <Boxes className="mr-2 h-4 w-4" />
                Raw Materials
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="production" className="outline-none">
            <ProductionPanel />
          </TabsContent>

          <TabsContent value="products" className="outline-none">
            <ProductsPanel />
          </TabsContent>

          <TabsContent value="materials" className="outline-none">
            <RawMaterialsPanel />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-slate-800 text-slate-200 text-xs py-2 px-4 flex flex-col sm:flex-row items-center justify-between z-50 gap-2 sm:gap-0 mt-auto">
        <div className="flex items-center gap-1">
          <span className="opacity-70">Status: </span>
          {isHealthy ? (
            <span className="font-medium text-emerald-400">Online</span>
          ) : (
            <span className="font-medium text-red-500 hover:underline cursor-help" title="Could not reach /health endpoint">Offline</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="opacity-70">Node: </span>
          <span className="font-medium">{hostname}</span>
        </div>
      </footer>
    </div>
  );
}
