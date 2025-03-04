import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prompt } from "@/gen/schema";
import PromptsDataTable from "@/components/PromptsDataTable";
import StatsCard from "@/components/StatsCard";

interface DataAndStatsTabPanelProps {
  prompts: Prompt[];
  currentFrame: number;
  numFrames: number;
  requestedWidth: number;
  requestedHeight: number;
  handlePromptClick: (index: number) => (e: React.MouseEvent) => void;
  imageVersion: number;
}

const DataAndStatsTabPanel: React.FC<DataAndStatsTabPanelProps> = ({
  prompts,
  currentFrame,
  numFrames,
  requestedWidth,
  requestedHeight,
  handlePromptClick,
  imageVersion,
}) => {
  return (
    <Tabs defaultValue="data" className="flex flex-col gap-1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="data">Prompt Data</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="data">
        <PromptsDataTable
          prompts={prompts}
          currentFrame={currentFrame}
          requestedWidth={requestedWidth}
          requestedHeight={requestedHeight}
          handlePromptClick={handlePromptClick}
        />
      </TabsContent>

      <TabsContent value="stats">
        <StatsCard prompts={prompts} numFrames={numFrames} imageVersion={imageVersion} />
      </TabsContent>
    </Tabs>
  );
};

export default DataAndStatsTabPanel;
