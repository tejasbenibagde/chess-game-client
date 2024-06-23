import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { MdEditSquare } from "react-icons/md";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  return (
    <div className="relative p-2 max-w-80 flex flex-col gap-2">
      <Button
        variant="secondary"
        className="w-full relative flex justify-start gap-2 overflow-hidden"
      >
        <Avatar className="h-7 w-7 overflow-hidden rounded-full">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>Jonathan Wengule</h1>
        <div className="absolute right-2 w-7 h-7 flex items-center justify-center bg-secondary">
          <MdEditSquare />
        </div>
      </Button>
      <Separator />
    </div>
  );
};

export default Navbar;
