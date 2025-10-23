"use client"

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavMain({
  items
}) {

  var { isMobile, open } = useSidebar()
  const [activeLink, setActiveLink] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);




  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu className="gap-[6px]">
        {items.map((item) => {

          var isActive = activeLink === item.url

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible">
              <SidebarMenuItem>


                <CollapsibleTrigger asChild>
                  <Link href={item.url || '#'}>
                    <SidebarMenuButton tooltip={item.title} className={`cursor-pointer flex items-center px-3 py-5 ${isActive ? 'bg-white hover:bg-white shadow-[0px_0px_5px_#0002]' : 'bg-transparent'}`}>

                      <div style={{ "--ionicon-stroke-width": 25 }} className={`pt-1 ${isActive ? 'text-blue-600' : 'text-gray-600'} ${open ? 'text-xl' : 'text-base'}`}>
                        {item.icon && <ion-icon name={isActive ? item.iconSolid : item.icon}></ion-icon>}
                      </div>

                      <div className={isActive ? 'text-blue-600 font-semibold tracking-tight' : 'text-gray-600 font-normal'}>{item.title}</div>


                      {item.items?.length > 0 && <ChevronRight
                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}


                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>


                {item.items?.length > 0 && <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>}



              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
