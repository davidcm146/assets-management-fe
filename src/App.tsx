import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./App.css";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background text-foreground">
        <Header />
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          <Outlet />
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
