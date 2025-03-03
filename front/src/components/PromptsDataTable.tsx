import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prompt } from "@/gen/schema";

const PromptsDataTable = ({
  prompts,
  currentFrame,
  requestedWidth,
  requestedHeight,
  handlePromptClick,
}: {
  prompts: Prompt[];
  currentFrame: number;
  requestedWidth: number;
  requestedHeight: number;
  handlePromptClick: (index: number) => (e: React.MouseEvent) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Coordinates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Frame</TableHead>
                <TableHead>Object ID</TableHead>
                <TableHead>X</TableHead>
                <TableHead>Y</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No points added yet. Click on the image to add points.
                  </TableCell>
                </TableRow>
              ) : (
                prompts.map((prompt, index) => (
                  <TableRow
                    key={index}
                    className={prompt.frame_idx === currentFrame ? "bg-accent/50" : ""}
                  >
                    <TableCell>{prompt.frame_idx}</TableCell>
                    <TableCell>{prompt.obj_id}</TableCell>
                    <TableCell>{(prompt.point.x * requestedWidth).toFixed(0)}</TableCell>
                    <TableCell>{(prompt.point.y * requestedHeight).toFixed(0)}</TableCell>
                    <TableCell>
                      <Badge variant={prompt.label === 1 ? "default" : "destructive"}>
                        {prompt.label === 1 ? "Positive" : "Negative"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={handlePromptClick(index)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-3">
        <div className="text-sm text-muted-foreground">Total points: {prompts.length}</div>
        <div className="text-sm text-muted-foreground">
          Current frame: {prompts.filter((p) => p.frame_idx === currentFrame).length} points
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptsDataTable;
