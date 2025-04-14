import { Application, Rectangle } from "pixi.js";
import { ColorPicker } from "./colorpicker";
import { Canvas, Dabbler } from "./surface";
import { Store } from "./store";
import { Button } from "./button";

(async () => {

  //for pixijs scene inspector chrome extension:
  //globalThis.__PIXI_APP__ = app;

  const app = new Application();
  await app.init({ background: "#787878", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  // Setup Scene Components
  const store = new Store(
    {r:0.5, g:0.5, b:0.5}, 
    .95
  );

  const canvas = new Canvas(
    app, 
    store,
    new Rectangle(0, 0, app.screen.width, app.screen.height * 0.75)
  );

  const dabbler = new Dabbler(
    app, 
    store,
    new Rectangle(0, app.screen.height * 0.75, app.screen.width * 0.96, app.screen.height * 0.10)
  );

  const color_picker = new ColorPicker(
    app, 
    store,
    new Rectangle(0, app.screen.height * 0.85, app.screen.width, app.screen.height * 0.15)
  );

  const tool_toggle = new Button(
    app,
    store,
    new Rectangle(app.screen.width * 0.96, app.screen.height * 0.75, app.screen.width * 0.04, app.screen.height * 0.10)
  );

  store.registerColorListener(dabbler);
  tool_toggle.registerButtonListener(canvas);
  
  // Compose scene graph
  app.stage.addChild(canvas.base, color_picker.base, dabbler.base, tool_toggle.base);

})();
