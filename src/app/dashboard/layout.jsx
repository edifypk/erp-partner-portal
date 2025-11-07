"use client"
import DashbaordNavbar from "@/components/nav/DashbaordNavbar"
import PreLoader from "@/components/PreLoader"
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
import { useAuth } from "@/context/AuthContextProvider"

const Layout = ({ children }) => {
    const { user,isLoading } = useAuth()
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


                {(isLoading) && <PreLoader />}

            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout
