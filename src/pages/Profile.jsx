import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../actions/userActions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { MdOutlineElectricBolt } from "react-icons/md";
import { FaChessKnight } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const dispatch = useDispatch();
  const { userDetails, loading, error, token } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!userDetails && token) {
      dispatch(fetchUser(token));
    }
  }, [userDetails, token, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-2 flex gap-2 flex-col md:flex-row">
      <div className="flex gap-2 flex-wrap w-full">
        <Card className="border-[1px] border-secondary w-full gap-0">
          <CardHeader className="flex-row justify-between pb-2">
            <h1 className="font-semibold">Profile Details</h1>
            <CgProfile className="opacity-[0.75]" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1>Profile Icon</h1>
              <Avatar className="h-12 w-12 relative overflow-hidden rounded-sm">
                <AvatarImage src={"https://github.com/shadcn.png"} />
                <AvatarFallback>
                  {userDetails?.username ? userDetails?.username[0] : "CN"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-2">
              <h1>Username:</h1>
              <h1 className="bold text-primary">{userDetails?.username}</h1>
            </div>
            <div className="flex gap-2">
              <h1>PlayerId:</h1>
              <h1 className="bold text-primary">{userDetails?.id}</h1>
            </div>
            <div className="flex gap-2">
              <h1>Email:</h1>
              <h1 className="bold text-primary">{userDetails?.email}</h1>
            </div>
            <div className="flex gap-2">
              <h1>Current Rating:</h1>
              <h1 className="bold text-primary">{userDetails?.rating}</h1>
            </div>
            <div className="flex gap-2">
              <h1>Created At:</h1>
              <h1 className="bold text-primary">{userDetails?.created_at}</h1>
            </div>
            <div className="flex gap-2">
              <h1>Updated At:</h1>
              <h1 className="bold text-primary">{userDetails?.updated_at}</h1>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Edit Profile</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex gap-2 flex-wrap w-full">
        <Card className="border-[1px] border-secondary w-[48.8%] md:w-1/3 gap-0">
          <CardHeader className="flex-row justify-between pb-2">
            <h1 className="font-semibold">Rating</h1>
            <MdOutlineElectricBolt className="opacity-[0.75]" />
          </CardHeader>
          <CardContent className="pb-0">
            <h1 className="font-extrabold text-2xl">{userDetails?.rating}</h1>
          </CardContent>
          <CardFooter className="opacity-[0.75]">
            <h1>Expert</h1>
          </CardFooter>
        </Card>
        <Card className="border-[1px] border-secondary w-[48.8%] md:w-1/3 gap-0">
          <CardHeader className="flex-row justify-between pb-2">
            <h1 className="font-semibold">Total Games</h1>
            <FaChessKnight className="opacity-[0.75]" />
          </CardHeader>
          <CardContent className="pb-0">
            <h1 className="font-extrabold text-2xl">
              {userDetails ? userDetails.total_games : 0}
            </h1>
          </CardContent>
          <CardFooter className="opacity-[0.75]">
            <h1>-</h1>
          </CardFooter>
        </Card>
        <Card className="border-[1px] border-secondary w-[48.8%] md:w-1/3 gap-0">
          <CardHeader className="flex-row justify-between pb-2">
            <h1 className="font-semibold">Friends</h1>
            <FaUserFriends className="opacity-[0.75]" />
          </CardHeader>
          <CardContent className="pb-0">
            <h1 className="font-extrabold text-2xl">
              {userDetails ? userDetails.friends : 0}
            </h1>
          </CardContent>
          <CardFooter className="opacity-[0.75]">
            <h1>-</h1>
          </CardFooter>
        </Card>
        <Card className="border-[1px] border-secondary w-[48.8%] md:w-1/3 gap-0">
          <CardHeader className="flex-row justify-between pb-2">
            <h1 className="font-semibold">Highest Rating</h1>
            <FaUserFriends className="opacity-[0.75]" />
          </CardHeader>
          <CardContent className="pb-0">
            <h1 className="font-extrabold text-2xl">{userDetails?.rating}</h1>
          </CardContent>
          <CardFooter className="opacity-[0.75]">
            <h1>Expert</h1>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
