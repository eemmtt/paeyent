import { Application, Container, FederatedPointerEvent, Graphics, Rectangle } from "pixi.js";
import { DrawDots, LassoFill, NullTool, Tool } from "./tools";
import { Store } from "./store";

interface ToolContext{
  tool: Tool;
  trigger: (event: FederatedPointerEvent) => void;
}

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
        this.curr_tool = new NullTool();
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

    }

}

export class Canvas extends Surface{
  tools: ToolContext[];
  tool_index: number;

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

    // Init ToolContexts to be used on canvas
    const lasso = new LassoFill();
    const lasso_trigger = (event: FederatedPointerEvent) => lasso.onPointerDown(event, this);
    const dots = new DrawDots();
    const dots_trigger = (event: FederatedPointerEvent) => dots.onPointerDown(event, this);

    this.tools = [
      {tool: lasso, trigger: lasso_trigger}, 
      {tool: dots, trigger: dots_trigger}
    ];
    this.tool_index = 0;

    this.curr_tool = this.tools[this.tool_index].tool;
    this.base.on('pointerdown', this.tools[this.tool_index].trigger);
  }

  onButtonUpdate(){
    //unregister current tool
    this.base.off('pointerdown', this.tools[this.tool_index].trigger);

    //set next tool and register pointerDown
    this.curr_tool = this.tools[(this.tool_index + 1) % this.tools.length].tool;
    this.tool_index = (this.tool_index + 1) % this.tools.length;
    this.base.on('pointerdown', this.tools[this.tool_index].trigger);
  }

}

export class Dabbler extends Surface{

  constructor(_app: Application, store: Store, rect: Rectangle){
    super(store);
    
    //Hacky inset to test layout with button, note app.screen.width
    const inset_x =  Math.max(_app.screen.width, rect.height)  * (1 - store.inset);
    const inset_y =  Math.max(_app.screen.width, rect.height)  * (1 - store.inset);

    const bg_rect = new Rectangle(
      rect.x + inset_x, 
      rect.y, 
      rect.width - 2 * inset_x, 
      rect.height - 0.25 * inset_y
    )
    this.background.rect(
      bg_rect.x,
      bg_rect.y,
      bg_rect.width,
      bg_rect.height
    );
    this.background.fill(0x8F8F8F);

    this.base.hitArea = bg_rect;

    this.previewer.rect(
      bg_rect.x, 
      bg_rect.y + bg_rect.height * 0.8, 
      bg_rect.width,
      bg_rect.height * 0.2
    )
    this.previewer.fill(0xFFFFFF);
    this.previewer.tint = store.getColorHex();

    this.curr_tool = new DrawDots();
    this.base.on('pointerdown', (event) => this.curr_tool.onPointerDown(event, this));
  }

  onColorUpdate(store: Store){
    this.previewer.tint = store.getColorHex();
  }
}