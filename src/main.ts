import { Application, Point } from "pixi.js";
import { ColorPicker } from "./colorpicker";
import { Surface } from "./surface";
import { Store } from "./store";

(async () => {

  //for pixijs scene inspector chrome extension:
  //globalThis.__PIXI_APP__ = app;

  const app = new Application();
  await app.init({ background: "#7F7F7F", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  //app.stage.eventMode = 'static';
  //app.stage.hitArea = app.screen;
  const store = new Store({r:0.5, g:0.5, b:0.5});
  
  // Todo: make sure that only one event handler is active at a time
  const surf_inset = 35; //px
  const surface = new Surface(app, surf_inset, store);
  const color_picker = new ColorPicker(app, surface, new Point(surf_inset, app.screen.height - 3 * surf_inset), store);

  // Compose scene graph
  app.stage.addChild(surface.base, color_picker.base);

})();
