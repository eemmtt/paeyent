import { Application, Container, Graphics, Rectangle } from "pixi.js";
import { DrawDots, LassoFill, Tool } from "./tools";
import { Store } from "./store";


export class Surface{
    base: Container;
    background: Graphics;
    mask: Graphics;
    history: Graphics;
    active: Graphics;
    marker: Graphics;
    previewer: Graphics;
    curr_tool: Tool;
    store: Store;

    constructor(store: Store){
        this.curr_tool = new LassoFill();
        this.store = store;

        this.base = new Container();
        this.base.eventMode = 'static';

        this.background = new Graphics();
        this.mask = this.background.clone();

        this.history = new Graphics();
        this.active = new Graphics();
        this.marker = new Graphics();
        this.marker.blendMode = 'difference';

        this.previewer = new Graphics();

        this.base.addChild(this.background, this.history, this.active, this.marker, this.previewer);
        this.history.mask = this.mask;
        this.active.mask = this.mask;

        this.base.on('pointerdown', (event) => this.curr_tool.onPointerDown(event, this));

    }

}

export class Canvas extends Surface{
  constructor(_app: Application, store: Store, rect: Rectangle){
    super(store);
    this.base.hitArea = rect;

    const inset_x =  Math.max(rect.width, rect.height) * (1 - store.inset);
    const inset_y =  Math.max(rect.width, rect.height) * (1 - store.inset);

    this.background.rect(
      rect.x + inset_x, 
      rect.y + inset_y, 
      rect.width - 2 * inset_x,
      rect.height - 2 * inset_y
    );
    this.background.fill(0x8F8F8F);

    this.curr_tool = new LassoFill();
  }
}

export class Dabbler extends Surface{

  constructor(_app: Application, store: Store, rect: Rectangle){
    super(store);
    this.base.hitArea = rect;

    const inset_x =  Math.max(rect.width, rect.height)  * (1 - store.inset);
    const inset_y =  Math.max(rect.width, rect.height)  * (1 - store.inset);

    this.background.rect(
      rect.x + inset_x, 
      rect.y, 
      rect.width - 2 * inset_x, 
      rect.height - 0.5 * inset_y);
    this.background.fill(0x8F8F8F);

    this.previewer.rect(
      rect.x + inset_x, 
      rect.y + rect.height - 0.5 * inset_y, 
      rect.width - 2 * inset_x,
      rect.height * 0.2
    )
    this.previewer.fill(0xFFFFFF);
    this.previewer.tint = store.getColorHex();

    this.curr_tool = new DrawDots();
  }

  onColorUpdate(store: Store){
    this.previewer.tint = store.getColorHex();
  }
}