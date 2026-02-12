import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes, Factory, Package } from "lucide-react";
import { ProductionPanel } from "./panels/ProductionPanel";
import { ProductsPanel } from "./panels/ProductsPanel";
import { RawMaterialsPanel } from "./panels/RawMaterialsPanel";

export function Dashboard() {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  return (
    <div className="min-w-480 min-h-dvh bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Factory className="h-6 w-6" />
          Inventory System
        </h1>
      </header>

      <main className="flex-1 p-8 w-full max-w-450 mx-auto">
        <Tabs defaultValue="products" className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="flex flex-row gap-4 border">
              <TabsTrigger
                value="production"
                className="data-[state=active]:text-white bg-white text-slate-400 hover:text-slate-400"
              >
                <Factory className="mr-2 h-4 w-4" />
                Production
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:text-white text-slate-400 hover:text-slate-400"
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:text-white text-slate-400 hover:text-slate-400"
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

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 text-slate-200 text-xs py-1 px-4 flex items-center justify-between z-50">
        <div>
          <span className="opacity-70">Status: </span>
          <span className="font-medium text-emerald-400">Online</span>
        </div>
        <div>
          <span className="opacity-70">Node: </span>
          <span className="font-medium">{hostname}</span>
        </div>
      </footer>
    </div>
  );
}
