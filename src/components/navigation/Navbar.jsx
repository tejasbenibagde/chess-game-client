import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { MdEditSquare, MdNotificationsActive } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { Separator } from "@/components/ui/separator";
import {
  FaArrowUp,
  FaArrowDown,
  FaHome,
  FaUserFriends,
  FaBookReader,
  FaHistory,
} from "react-icons/fa";
import { AiOutlineAim } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/actions/userActions";
import { IoMenu } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

import useWindowDimensions from "@/hooks/useWindowDimensions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails, loading, error, token } = useSelector(
    (state) => state.user
  );
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!userDetails && token) {
      console.log("fetching user ");
      dispatch(fetchUser(token));
    }
  }, [userDetails, token, dispatch]);

  const buttonItems = [
    { icon: FaHome, label: "Home", path: "/" },
    { icon: FaUserFriends, label: "2 Player", path: "/two-player" },
    // {
    //   icon: MdNotificationsActive,
    //   label: "Notifications",
    //   count: 13,
    //   path: "/notifications",
    // },
    // {
    //   icon: ImStatsDots,
    //   label: "Stats",
    //   count: userDetails ? userDetails.stats : "0",
    //   countClass: userDetails
    //     ? userDetails.stats >= 0
    //       ? "text-green-300"
    //       : "text-red-300"
    //     : "-",
    //   countIcon: userDetails?.stats >= 0 ? FaArrowUp : FaArrowDown,
    //   path: "/stats",
    // },
    // {
    //   icon: FaHistory,
    //   label: "Games",
    //   count: userDetails ? userDetails.total_games : 0,
    //   path: `/games/${userDetails?.id}`,
    // },
    // {
    //   icon: FaUserFriends,
    //   label: "Friends",
    //   count: userDetails ? userDetails.friends : 0,
    //   path: "/friends",
    // },
    // { separator: true },
    // {
    //   icon: FaBookReader,
    //   label: "Learn Chess",
    //   count: 43,
    //   path: "/learn-chess",
    // },
    // { icon: AiOutlineAim, label: "Practice", path: "/practice" },
    // { icon: IoSettingsSharp, label: "Settings", path: "/settings" },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return width <= 768 ? (
    <NavbarSM userDetails={userDetails} buttonItems={buttonItems} />
  ) : (
    <div className="top-0 border-[1px] border-secondary sm:border-none left-0 relative p-2 w-full md:max-w-80 h-[100vh] flex flex-col gap-2">
      <>
        {userDetails ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="tertiary"
                  className="w-full relative flex justify-start gap-2 overflow-hidden border-[1px] border-secondary"
                  onClick={() => navigate(`/profile/${userDetails.id}`)}
                >
                  <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                    <AvatarImage src={"https://github.com/shadcn.png"} />
                    <AvatarFallback>
                      {userDetails.username ? userDetails.username[0] : "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <h1>{userDetails.username}</h1>
                  <div className="absolute right-2 w-7 h-7 flex items-center justify-center bg-tertiary">
                    <MdEditSquare />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button onClick={() => navigate("/login")}>Login/Signup</Button>
        )}
        <Separator />
        {buttonItems.map((item, index) =>
          item.separator ? (
            <Separator key={index} />
          ) : (
            <Button
              key={index}
              variant="tertiary"
              className={`w-full relative flex justify-between gap-2 overflow-hidden hover:bg-secondary active:bg-secondary`}
              onClick={() => navigate(item.path)}
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
      </>
    </div>
  );
};

const NavbarSM = ({ buttonItems, userDetails }) => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  console.log(nav)
  return (
    <div className="p-2 w-full border-b-[1px] border-secondary flex justify-between">
      {userDetails ? (
        <Button
          variant="tertiary"
          className="p-0 border-none relative flex justify-start gap-2 overflow-hidden border-[1px] border-secondary"
          onClick={() => navigate(`/profile/${userDetails.id}`)}
        >
          <Avatar className="h-7 w-7 overflow-hidden rounded-full">
            <AvatarImage src={"/images/q4.jpg"} />
            <AvatarFallback>
              {userDetails.username ? userDetails.username[0] : "CN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      ) : (
        <Button onClick={() => navigate("/login")}>Login/Signup</Button>
      )}
      {/* <Button variant="secondary" onClick={() => setNav(!nav)}><IoMenu size={18} /></Button> */}
      <Popover>
        <PopoverTrigger className={cn(buttonVariants({ variant: "secondary" }))}>
          <IoMenu size={18} />
        </PopoverTrigger>
        <PopoverContent>
          {buttonItems.map((item, index) =>
            item.separator ? (
              <Separator key={index} />
            ) : (
              <Button
                key={index}
                variant="tertiary"
                className={`w-full relative flex justify-between gap-2 overflow-hidden hover:bg-secondary active:bg-secondary`}
                onClick={() => navigate(item.path)}
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
        </PopoverContent>
      </Popover>

    </div>
  );
};

export default Navbar;
