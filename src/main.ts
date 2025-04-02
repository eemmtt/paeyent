import { Application, FederatedMouseEvent, Graphics } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();
  //globalThis.__PIXI_APP__ = app; //for chrome extension
  await app.init({ background: "#8d8d8d", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('mousedown', mouseDown);
  app.stage.on('mouseup', mouseUp);
  app.stage.on('mousemove', mouseMove);
  app.stage.on('rightdown', rightDown);

  const artboard = new Graphics();
  const inset = 50;
  const a_height = app.screen.height - (2 * inset);
  const a_width = app.screen.width - (2 * inset);
  artboard.rect(inset, inset, a_width, a_height);
  artboard.fill(0x888888);

  const brush_mask = artboard.clone();

  const brush = new Graphics();
  
  app.stage.addChild(brush_mask, artboard, brush);
  brush.mask = brush_mask;
 
  let isDrawing = false;

  //Event Handlers
  function mouseDown(event: FederatedMouseEvent) {
    console.log(event.button);
    isDrawing = true;
  };

  function mouseUp() {
    isDrawing = false;
  };

  function mouseMove(event: FederatedMouseEvent) {
    
    if (isDrawing) {
      const {x , y} = event.global;
      brush.fill(0x110000); // Red brush
      brush.circle(x, y, 5); // 5px circle as "brush"
    }
  };

  function rightDown(event: FederatedMouseEvent) {
    console.log(event.button);
  }

  /*
  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    //container.rotation += 0.1 * time.deltaTime;
    
  });
  */

})();
