import { Application, FederatedPointerEvent, Graphics, Point } from "pixi.js";

(async () => {
  const app = new Application();
  //globalThis.__PIXI_APP__ = app; //for pixijs scene inspector chrome extension
  await app.init({ background: "#8d8d8d", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  // Configure stage and register Event handlers
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', pointerDown);
  app.stage.on('pointerup', pointerUp);
  app.stage.on('pointermove', pointerMove);
  app.stage.on('rightdown', rightDown);

  // Setup the drawing layer_base
  const layer_base = new Graphics();
  const inset = 50;
  const a_height = app.screen.height - (2 * inset);
  const a_width = app.screen.width - (2 * inset);
  layer_base.rect(inset, inset, a_width, a_height);
  layer_base.fill(0x888888);

  // Create an layer_base shaped mask for the mark making
  const layer_mask = layer_base.clone();

  // Create graphics object for the mark making
  const layer_history = new Graphics();
  const layer_active = new Graphics();
  
  const draw_tool = (cnv: Graphics, pts: Array<Point>) => {
    pts.forEach(pt => {
      cnv.circle(pt.x, pt.y, 5);
    });
    cnv.fill(0x110000);
  }

  // Event Handlers
  let isDrawing: boolean = false;
  let dPoints: Array<Point> = [];
  const currTool = draw_tool;

  function pointerDown() {
    if (!isDrawing){
      //console.log(event.button);
      isDrawing = true;
    }
  };

  function pointerUp() {
    if (isDrawing){
      currTool(layer_history, dPoints);
      layer_active.clear();
      dPoints = [];
      isDrawing = false;
    }
  };

  function pointerMove(event: FederatedPointerEvent) {
    if (isDrawing) {
      dPoints.push(new Point(event.globalX, event.globalY));
      currTool(layer_active, dPoints);
    }
  };

  function rightDown(event: FederatedPointerEvent) {
    console.log(event.button);
  }

  
  /*/ Listen for animate update
  app.ticker.add((time) => {
    //container.rotation += 0.1 * time.deltaTime;
  });
  */
  

  // Compose scene graph
  app.stage.addChild(layer_base, layer_history, layer_active);
  layer_history.mask = layer_mask;
  layer_active.mask = layer_mask;

})();
