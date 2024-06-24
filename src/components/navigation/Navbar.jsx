import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { MdEditSquare, MdNotificationsActive } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { Separator } from "@/components/ui/separator";
import {
  FaArrowUp,
  FaHome,
  FaUserFriends,
  FaBookReader,
  FaHistory,
} from "react-icons/fa";
import { AiOutlineAim } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";

const buttonItems = [
  { icon: FaHome, label: "Home", path: "/" },
  {
    icon: MdNotificationsActive,
    label: "Notifications",
    count: 13,
    path: "/notifications",
  },
  {
    icon: ImStatsDots,
    label: "Stats",
    count: "+910",
    countClass: "text-green-300",
    countIcon: FaArrowUp,
    path: "/stats",
  },
  { icon: FaHistory, label: "Games", count: 428, path: "/games" },
  { icon: FaUserFriends, label: "Friends", count: 23, path: "/friends" },
  { separator: true },
  { icon: FaBookReader, label: "Learn Chess", count: 43, path: "/learn-chess" },
  { icon: AiOutlineAim, label: "Practice", path: "/practice" },
  { icon: IoSettingsSharp, label: "Settings", path: "/settings" },
];

const Navbar = () => {
  return (
    <div className="relative p-2 max-w-80 h-[100vh] flex flex-col gap-2">
      <Button
        variant="tertiary"
        className="w-full relative flex justify-start gap-2 overflow-hidden border-[1px] border-secondary"
      >
        <Avatar className="h-7 w-7 overflow-hidden rounded-full">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>Jonathan Wengule</h1>
        <div className="absolute right-2 w-7 h-7 flex items-center justify-center bg-tertiary">
          <MdEditSquare />
        </div>
      </Button>
      <Separator />
      {buttonItems.map((item, index) =>
        item.separator ? (
          <Separator key={index} />
        ) : (
          <Button
            key={index}
            variant="tertiary"
            className={`w-full relative flex justify-between gap-2 overflow-hidden hover:bg-secondary active:bg-secondary `}
          >
            <div className="flex gap-2 items-center">
              <item.icon />
              <h1>{item.label}</h1>
            </div>
            {item.count && (
              <div className={`flex items-center ${item.countClass || ""}`}>
                <h1>{item.count}</h1>
                {item.countIcon && <item.countIcon />}
              </div>
            )}
          </Button>
        )
      )}
    </div>
  );
};

export default Navbar;
