import { Graphics } from "pixi.js";
import { ToolStore } from "./tool_store";

export type Tool = (active: boolean, cnv: Graphics, store: ToolStore) => void;

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