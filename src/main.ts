import { Application, Point } from "pixi.js";
import { ColorPicker } from "./colorpicker";
import { Surface } from "./surface";

(async () => {

  //for pixijs scene inspector chrome extension:
  //globalThis.__PIXI_APP__ = app;

  const app = new Application();
  await app.init({ background: "#8d8d8d", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  
  // Todo: make sure that only one event handler is active at a time
  const surface = new Surface(app);
  const color_picker = new ColorPicker(app, new Point(50, app.screen.height - 120));

  // Compose scene graph
  app.stage.addChild(surface.base, color_picker.base);

})();
