import DashbaordNavbar from "@/components/nav/DashbaordNavbar"
import AppSidebar from "@/components/Sidebar/Sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

const Layout = ({ children }) => {
    return (
        <SidebarProvider className="h-screen overflow-hidden">
            <AppSidebar className="border" />
            <SidebarInset className="h-full flex flex-col">

                <div className="h-14">
                    <DashbaordNavbar />
                </div>

                <div className="flex-1 overflow-hidden">
                    {children}
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout
