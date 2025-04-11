import { Application, Container, Graphics, Point, Rectangle } from "pixi.js";
import { LassoFill, Tool } from "./tools";
import { Store } from "./store";


export class Surface{
    base: Container;
    background: Graphics;
    mask: Graphics;
    history: Graphics;
    active: Graphics;
    marker: Graphics;
    is_drawing: boolean;
    pts: Array<Point>;
    curr_tool: Tool;
    store: Store;

    constructor(app: Application, inset: number, store: Store){
        this.is_drawing = false;
        this.pts = [];
        this.curr_tool = new LassoFill();
        this.store = store;

        this.base = new Container();
        this.base.eventMode = 'static';
        this.base.hitArea = new Rectangle(0,0,app.screen.width, app.screen.height - 3 * inset);
        
        const a_height = app.screen.height - (3 * inset);
        const a_width = app.screen.width - (2 * inset);
        this.background = new Graphics();
        this.background.rect(inset, inset, a_width, a_height - 2 * inset);
        this.background.fill(0x8F8F8F);

        this.mask = this.background.clone();

        this.history = new Graphics();
        this.active = new Graphics();

        this.marker = new Graphics();
        this.marker.blendMode = 'difference';

        this.base.addChild(this.background, this.history, this.active, this.marker);
        this.history.mask = this.mask;
        this.active.mask = this.mask;

        this.base.on('pointerdown', (event) => this.curr_tool.onPointerDown(event, this));

    }

}