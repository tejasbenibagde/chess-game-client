import { Link } from "react-router-dom";
import { FaNetworkWired } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { FaPeopleRobbery } from "react-icons/fa6";
const Home = () => {
  const gameModes = [
    {
      name: "Online Play",
      link: "/online-play",
      icon: <FaNetworkWired size={30} />,
    },
    {
      name: "Play With computer",
      link: "/play-computer",
      icon: <BsRobot size={30} />,
    },
    {
      name: "Play With Friend",
      link: "/two-player",
      icon: <FaPeopleRobbery size={30} />,
    },
  ];

  return (
    <div className="h-[90vh] flex flex-col px-3 py-4 gap-4">
      {gameModes.map(({ name, link, icon }, i) => (
        <Link to={link} key={i} className="h-[10vh] bg-primary rounded-md px-3 flex items-center gap-3">
          <div className="bg-secondary flex items-center justify-center h-[8vh] w-[8vh] rounded-md">{icon}</div>
          <span>{name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Home;
