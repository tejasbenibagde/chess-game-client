import React from "react";
import AppRoutes from "./AppRoutes"; // these provides the main game feature we'll be handling it very soon
import Navbar from "./components/navigation/Navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import useWindowDimensions from "./hooks/useWindowDimensions";
const Dashboard = () => {
  const { width } = useWindowDimensions();
  console.log
  return (
    <div className="w-[100vw] max-w-[100vw] relative">
      {
        width <= 768 ? (
          <DashboardSM />
        ) :
          (<ResizablePanelGroup direction={width <= 768 ? "verical" : "horizontal"}>
            <ResizablePanel minSize={14} maxSize={18}>
              <Navbar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <AppRoutes />
            </ResizablePanel>
          </ResizablePanelGroup>)

      }
    </div>
  );
};

const DashboardSM = () => {
  return (
    <div className="w-[100vw] max-w-[100vw] relative">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default Dashboard;
