import { Link } from "react-router-dom";

const Navbar = () => {
  const routes = [
    {
      path: "/",
      name: "Home",
    },
    // {
    //   path: "/profile/:id",
    //   name: "Profile",
    // },
  ];

  return (
    <div className="w-full h-[10vh] flex items-center px-[5vw] border-b-[1px] border-[#606568]">
      <nav className="flex justify-between">
        {routes.map(({ path, name }, i) => (
          <Link to={path} key={i} className="mx-2">
            {name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
