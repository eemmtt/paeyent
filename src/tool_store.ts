import { Graphics, Point } from "pixi.js";
import { draw_tool, Tool } from "./tools";

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