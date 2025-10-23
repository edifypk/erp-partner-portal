"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconBrandYoutubeFilled,
  IconTerminal2,
} from "@tabler/icons-react";
import { Facebook02Icon, Home03Icon, Home07Icon, Home09Icon, InstagramIcon, Linkedin02Icon, NewTwitterIcon, YoutubeIcon } from "hugeicons-react";

const FloatingNav = () => {
  const links = [
    {
      title: "Home",
      icon: (
        <Home09Icon className="h-full w-full text-gray-500" />
      ),
      isInternal:true,
      href: "/",
    },

    {
      title: "Instagram",
      icon: (
        <InstagramIcon className="h-full w-full text-gray-500" />
      ),
      href: "#",
    },
    {
      title: "Facebook",
      icon: (
        <Facebook02Icon className="h-full w-full text-gray-500" />
      ),
      href: "#",
    },
    {
      title: "Edify Group",
      icon: (
        <img
          src="https://erp.edify.pk/images/eBlue.svg"
          width={20}
          height={20}
          alt="Aceternity Logo" />
      ),
      href: "https://edify.pk",
    },
    {
      title: "Linkedin",
      icon: (
        <Linkedin02Icon className="h-full w-full text-gray-500" />
      ),
      href: "#",
    },

    {
      title: "Twitter",
      icon: (
        <NewTwitterIcon className="h-full w-full text-gray-500" />
      ),
      href: "#",
    },
    {
      title: "YouTube",
      icon: (
        <YoutubeIcon className="h-full w-full text-gray-500" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="flex items-center justify-end w-full fixed bottom-6 left-0 z-50 px-6">
      <FloatingDock
        // only for demo, remove for production
        mobileClassName="translate-y-20"
        desktopClassName="border border-gray-200"
        items={links} />
    </div>
  );
}

export default FloatingNav