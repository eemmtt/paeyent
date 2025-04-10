import { Surface } from "./surface";
import { Store } from "./store";

export type Tool = (active: boolean, srf: Surface, store: Store) => void;

/**
 * Draws a series of filled circles on a Graphics object at the specified points.
 * @param active - Whether the tool is actively in use, as opposed to being called from a history stack
 * @param cnv - The Graphics object to draw on
 * @param store - A Tool Store object containing the relevant context state
 */
export function draw_tool(active: boolean, srf: Surface, store: Store) {
    
    if (srf.draw_pts.length == 0){ return; }

    if (active){
      const last_pt = srf.draw_pts[srf.draw_pts.length - 1];
      srf.active.circle(last_pt.x, last_pt.y, 5);
      srf.active.fill(store.getColorRGBA());
      return;
    }

    if (!active){
      srf.draw_pts.forEach(pt => {
        srf.history.circle(pt.x, pt.y, 5);
        srf.history.fill(store.getColorRGBA());
      });
      return;
    }
}