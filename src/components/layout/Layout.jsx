import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Sidebar — fixed */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-[260px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
