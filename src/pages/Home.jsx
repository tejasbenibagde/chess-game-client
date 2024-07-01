import ChessBoard from "@/components/ChessBoard";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { RiUserLocationLine, RiRobot3Fill } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { height } = useWindowDimensions();
  const width = height / 1.618;

  const navigate = useNavigate();
  return (
    <div className="p-2 w-[100vw] flex flex-col">
      {
        width > 768 &&
        <>
          <div className="mb-2">
            <h1 className={cn(buttonVariants({ variant: "tertiary" }))}>
              The oldest known chess game recorded in history is from the 10th
              century, played between a historian from Baghdad and his student.
            </h1>
          </div>
          <Separator />
        </>
      }

      <div className="relative mt-2 px-2 gap-4 flex flex-col items-center justify-center md:flex-row md:items-start md:justify-start">
        {width > 768 && <div
          style={{ width: `${width}px`, height: `${width}px` }}
          className="relative overflow-hidden rounded-md"
        >
          <ChessBoard width={width} position="start" />
        </div>}
        <div
          style={{ width: `${width}px` }}
          className="relative overflow-hidden flex flex-col gap-4 p-4 items-center justify-center"
        >
          <h1 className="text-5xl leading-tight font-extrabold text-center">
            Play Chess <br /> Online <br /> on the #1 Site!
          </h1>
          {/* <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <h1>
              <span className="font-extrabold">13,873,735</span> Games Today
            </h1>
            <h1>
              <span className="font-extrabold">108,559</span> Playing Now
            </h1>
          </div> */}
          <div className="flex flex-col items-center justify-center  gap-2 p-2">
            <Button
              className="flex relative gap-4 p-4 h-auto w-full justify-start pl-[76px]"
              onClick={() => navigate("/online-play")}
            >
              <div className="absolute left-4">
                <RiUserLocationLine size={48} />
              </div>
              <div className="flex flex-col gap-2 items-start justify-start">
                <h1 className="font-bold text-4xl">Play Online</h1>
                <h1 className="font-semibold">
                  Play with someone at your level
                </h1>
              </div>
            </Button>
            <Button
              className="flex relative gap-4 p-4 h-auto w-full justify-start pl-[76px]"
              onClick={() => navigate("play-computer")}
            >
              <div className="absolute left-4">
                <RiRobot3Fill size={48} />
              </div>
              <div className="flex flex-col gap-2 items-start justify-start">
                <h1 className="font-bold text-4xl">Play Computer</h1>
                <h1 className="font-semibold">
                  Play vs Customizable Training Bots
                </h1>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
