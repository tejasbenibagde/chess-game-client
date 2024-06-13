import { Link } from "react-router-dom";

const Home = () => {
  const gameModes = [
    {
      name: "Online Play",
      link: "/online-play",
    },
    {
      name: "Play With computer",
      link: "/play-computer",
    },
    {
      name: "Play With Friend",
      link: "/two-player",
    },
  ];

  return (
    <div className="w-full h-[90vh] flex flex-wrap justify-around pt-[5vh]">
      {gameModes.map(({ name, link }, i) => (
        <Link to={link} key={i}>
          <span className="bg-green-500 w-[45vw] h-[50vw] md:h-[20vw] lg:w-[30vw] flex items-center justify-center rounded-md">
            {name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Home;
