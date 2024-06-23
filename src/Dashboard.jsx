import React from "react";
import AppRoutes from "./AppRoutes"; // these provides the main game feature we'll be handling it very soon
import Navbar from "./components/navigation/Navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Dashboard = () => {
  return (
    <div>
      {/* <AppRoutes /> */}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={14} maxSize={18}>
          <Navbar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
