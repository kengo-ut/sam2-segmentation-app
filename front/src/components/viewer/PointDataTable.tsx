import React from "react";
import { Download, Trash2 } from "lucide-react";
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
import { Point } from "@/types";

const PointsDataTable = ({
  points,
  currentFrame,
  requestedWidth,
  requestedHeight,
  exportPoints,
  handlePointClick,
}: {
  points: Point[];
  currentFrame: number;
  requestedWidth: number;
  requestedHeight: number;
  exportPoints: () => void;
  handlePointClick: (index: number) => (e: React.MouseEvent) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between">
          <span>Coordinates</span>
          <Button onClick={exportPoints} variant="outline" size="sm">
            <Download /> Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Frame</TableHead>
                <TableHead>X</TableHead>
                <TableHead>Y</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {points.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No points added yet. Click on the image to add points.
                  </TableCell>
                </TableRow>
              ) : (
                points.map((point, index) => (
                  <TableRow
                    key={index}
                    className={point.frameIndex === currentFrame ? "bg-accent/50" : ""}
                  >
                    <TableCell>{point.frameIndex}</TableCell>
                    <TableCell>{(point.x * requestedWidth).toFixed(0)}</TableCell>
                    <TableCell>{(point.y * requestedHeight).toFixed(0)}</TableCell>
                    <TableCell>
                      <Badge variant={point.label === 1 ? "default" : "destructive"}>
                        {point.label === 1 ? "Positive" : "Negative"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={handlePointClick(index)}>
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
        <div className="text-sm text-muted-foreground">Total points: {points.length}</div>
        <div className="text-sm text-muted-foreground">
          Current frame: {points.filter((p) => p.frameIndex === currentFrame).length} points
        </div>
      </CardFooter>
    </Card>
  );
};

export default PointsDataTable;
