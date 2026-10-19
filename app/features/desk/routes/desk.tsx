import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DeskSidebar from "../components/sidebar";
import BottomNavbar from "../components/bottom-navbar";
import { Outlet, useOutlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import Home from "../components/home";

export default function Desk() {
  const outlet = useOutlet();

  if (!outlet) {
    return <Home />;
  }

  return (
    <Fragment>
      <SidebarProvider>
        <DeskSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </Fragment>
  );
}
