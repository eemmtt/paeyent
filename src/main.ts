import { Application, Rectangle } from "pixi.js";
import { ColorPicker } from "./colorpicker";
import { Canvas, Dabbler } from "./surface";
import { Store } from "./store";

(async () => {

  //for pixijs scene inspector chrome extension:
  //globalThis.__PIXI_APP__ = app;

  const app = new Application();
  await app.init({ background: "#7F7F7F", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  // Setup Scene Components
  const store = new Store(
    {r:0.5, g:0.5, b:0.5}, 
    .95
  );

  const canvas = new Canvas(
    app, 
    store,
    new Rectangle(0,0,app.screen.width,app.screen.height * 0.75)
  );

  const dabbler = new Dabbler(
    app, 
    store,
    new Rectangle(app.screen.width * 0.5, app.screen.height * 0.75, app.screen.width * 0.5, app.screen.height * 0.25)
  );

  const color_picker = new ColorPicker(
    app, 
    store,
    new Rectangle(0, app.screen.height * 0.75, app.screen.width * 0.5, app.screen.height * 0.25)
  );

  store.registerColorListener(dabbler);
  
  // Compose scene graph
  app.stage.addChild(canvas.base, color_picker.base, dabbler.base);

})();
