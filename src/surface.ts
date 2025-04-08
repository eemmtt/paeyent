import { Application, Container, Graphics, Point, FederatedPointerEvent } from "pixi.js";
import { Tool, draw_tool } from "./tools";


export class Surface{
    base: Container;
    background: Graphics;
    mask: Graphics;
    history: Graphics;
    active: Graphics;
    is_drawing: boolean;
    draw_pts: Array<Point>;
    curr_tool: Tool;

    constructor(app: Application){
        this.is_drawing = false;
        this.draw_pts = [];
        this.curr_tool = draw_tool;

        this.base = new Container();
        this.background = new Graphics();
        const inset = 50;
        const a_height = app.screen.height - (2 * inset);
        const a_width = app.screen.width - (2 * inset);

        this.background.rect(inset, inset, a_width, a_height - 2 * inset);
        this.background.fill(0x888888);

        this.mask = this.background.clone();
        this.history = new Graphics();
        this.active = new Graphics();

        this.base.addChild(this.background, this.history, this.active);
        this.history.mask = this.mask;
        this.active.mask = this.mask;

        app.stage.on('pointerdown', this.toolStart, this);

    }

    private toolStart(this: Surface) {
        if (!this.is_drawing){
          this.is_drawing = true;
          this.base.parent.on('pointermove', this.toolMove, this);
          this.base.parent.on('pointerup', this.toolStop, this);
        }
    };
    
    private toolStop(this: Surface) {
        if (this.is_drawing){
          this.curr_tool(false, this);
          this.active.clear();

          this.draw_pts = [];
          this.is_drawing = false;
          this.base.parent.off('pointermove', this.toolMove, this);
          this.base.parent.off('pointerup', this.toolStop, this);
        }
    };
    
    private toolMove(this: Surface, event: FederatedPointerEvent) {
        if (this.is_drawing) {
          this.draw_pts.push(new Point(event.globalX, event.globalY));
          this.curr_tool(true, this);
        }
    };
}