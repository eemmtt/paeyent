import { Application, FederatedPointerEvent, Graphics } from "pixi.js";

(async () => {

  // Setup
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

  // Setup the drawing surface ('artboard')
  const artboard = new Graphics();
  const inset = 50;
  const a_height = app.screen.height - (2 * inset);
  const a_width = app.screen.width - (2 * inset);
  artboard.rect(inset, inset, a_width, a_height);
  artboard.fill(0x888888);

  // Create an artboard shaped mask for the mark making
  const brush_mask = artboard.clone();

  // Create graphics object for the mark making
  const brush = new Graphics();
  
  // Setup scene hierarchy
  app.stage.addChild(artboard, brush_mask, brush);
  brush.mask = brush_mask;
  
  // Event Handlers
  let isDrawing = false;

  function pointerDown(event: FederatedPointerEvent) {
    console.log(event.button);
    isDrawing = true;
  };

  function pointerUp() {
    isDrawing = false;
  };

  function pointerMove(event: FederatedPointerEvent) {
    
    if (isDrawing) {
      const {x , y} = event.global;
      brush.fill(0x110000);
      brush.circle(x, y, 5);
    }
  };

  function rightDown(event: FederatedPointerEvent) {
    console.log(event.button);
  }

  /*
  // Listen for animate update
  app.ticker.add((time) => {
    //container.rotation += 0.1 * time.deltaTime;
  });
  */

})();
