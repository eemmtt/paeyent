import { Graphics, Point, FederatedPointerEvent } from "pixi.js";

export type Tool = (active: boolean, cnv: Graphics, store: ToolStore) => void;

export class ToolStore{
    is_drawing: boolean;
    draw_pts: Array<Point>;
    curr_tool: Tool;
    history_layer: Graphics;
    active_layer: Graphics;

    constructor(history_layer: Graphics, active_layer: Graphics){
        this.is_drawing = false;
        this.draw_pts = [];
        this.curr_tool = draw_tool;
        this.history_layer = history_layer;
        this.active_layer = active_layer;
    }
}

// Tool functions

/**
 * Draws a series of filled circles on a Graphics object at the specified points.
 * @param active - Whether the tool is actively in use, as opposed to being called from a history stack
 * @param cnv - The Graphics object to draw on
 * @param store - A Tool Store object containing the relevant context state
 */
export function draw_tool(active: boolean, cnv: Graphics, store: ToolStore) {
    
    if (store.draw_pts.length == 0){ return; }

    if (active){
      const last_pt = store.draw_pts[store.draw_pts.length - 1];
      cnv.circle(last_pt.x, last_pt.y, 5);
      cnv.fill(0x110000);
      return;
    }

    if (!active){
        store.draw_pts.forEach(pt => {
            cnv.circle(pt.x, pt.y, 5);
            cnv.fill(0x110000);
      });
      return;
    }
}

// Event Handlers
export function toolStart(this: ToolStore) {
    if (!this.is_drawing){
      //console.log(event.button);
      this.is_drawing = true;
    }
};

export function toolStop(this: ToolStore) {
    if (this.is_drawing){
      this.curr_tool(false, this.history_layer, this);
      this.active_layer.clear();
      this.draw_pts = [];
      this.is_drawing = false;
    }
};

export function toolMove(this: ToolStore, event: FederatedPointerEvent) {
    if (this.is_drawing) {
      this.draw_pts.push(new Point(event.globalX, event.globalY));
      this.curr_tool(true, this.active_layer, this);
    }
};