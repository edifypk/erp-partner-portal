"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Edify Group",
      logo: GalleryVerticalEnd,
      plan: "Partner Portal",
    }
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: 'home-outline',
      iconSolid: 'home',
      isActive: true
    },
    {
      title: "Course Search",
      url: "/dashboard/course-search",
      icon: 'search-outline',
      iconSolid: 'search',
      isActive: true
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: 'people-outline',
      iconSolid: 'people',
      isActive: true
    },
    {
      title: "Applications",
      url: "/dashboard/applications",
      icon: 'layers-outline',
      iconSolid: 'layers',
      isActive: true
    },
  ]
}

const AppSidebar = ({
  ...props
}) => {
  return (
    <Sidebar collapsible="icon" {...props} className="border-gray-100">


      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>



      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>



      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}


      <SidebarRail />


    </Sidebar>
  );
}

export default AppSidebar;
