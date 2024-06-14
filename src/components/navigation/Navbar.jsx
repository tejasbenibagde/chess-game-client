import { Link } from "react-router-dom";

import { Button } from "../ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const routes = [
    {
      path: "/",
      name: "Home",
    },
  ];

  return (
    <div className="relative w-full h-[5vh]">
      <div className="w-full top-0 fixed h-[5vh] bg-secondary flex items-center justify-center">
        <nav className="flex w-[100vw] justify-between items-center">
          {routes.map(({ path, name }, i) => (
            <Button asChild size={"sm"}>
              <Link to={path} key={i} className="mx-2">
                {name}
              </Link>
            </Button>
          ))}
          <div className="px-2 py-2">
            <Avatar size={"sm"}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
