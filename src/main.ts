import { Application, Graphics } from "pixi.js";
import { ToolStore } from "./tool_store";
import { pointerDown, pointerUp, pointerMove, rightDown } from "./tool_handlers";

(async () => {
  // Setup
  //globalThis.__PIXI_APP__ = app; //for pixijs scene inspector chrome extension
  const app = new Application();
  await app.init({ background: "#8d8d8d", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);  

  // Setup Containers
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  
  const layer_base = new Graphics();
  const inset = 50;
  const a_height = app.screen.height - (2 * inset);
  const a_width = app.screen.width - (2 * inset);
  layer_base.rect(inset, inset, a_width, a_height - 2 * inset);
  layer_base.fill(0x888888);

  // Create an layer_base shaped mask for the mark making
  const layer_mask = layer_base.clone();

  // Create graphics objects for the mark making
  const history_layer = new Graphics();
  const active_layer = new Graphics();

  // Init store
  const tool_store = new ToolStore(history_layer, active_layer);

  // Register Event Handlers
  app.stage.on('pointerdown', pointerDown, tool_store);
  app.stage.on('pointerup', pointerUp, tool_store);
  app.stage.on('pointermove', pointerMove, tool_store);
  app.stage.on('rightdown', rightDown, tool_store);

  // Compose scene graph
  app.stage.addChild(layer_base, history_layer, active_layer);
  history_layer.mask = layer_mask;
  active_layer.mask = layer_mask;

})();
