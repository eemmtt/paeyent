import { FederatedPointerEvent, Point } from "pixi.js";
import { ToolStore } from "./tool_store";

export function pointerDown(this: ToolStore) {
    if (!this.is_drawing){
      //console.log(event.button);
      this.is_drawing = true;
    }
  };

export function pointerUp(this: ToolStore) {
    if (this.is_drawing){
      this.curr_tool(false, this.history_layer, this);
      this.active_layer.clear();
      this.draw_pts = [];
      this.is_drawing = false;
    }
  };

export function pointerMove(this: ToolStore, event: FederatedPointerEvent) {
    if (this.is_drawing) {
      this.draw_pts.push(new Point(event.globalX, event.globalY));
      this.curr_tool(true, this.active_layer, this);
    }
  };

export function rightDown(event: FederatedPointerEvent) {
    console.log(event.button);
  }
