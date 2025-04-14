import { Surface } from "./surface";
import { FederatedPointerEvent, Point } from "pixi.js";

//export type Tool = (active: boolean, srf: Surface, store: Store) => void;
export interface Tool{
  is_drawing: boolean,
  pts: Point[],
  active_draw(srf: Surface, curr_pt: Point): void,
  inactive_draw(srf: Surface): void,
  onPointerDown(event: FederatedPointerEvent, srf: Surface): void,
  onPointerUp(event: FederatedPointerEvent, srf: Surface): void,
  onPointerMove(event: FederatedPointerEvent, srf: Surface): void
}

export class NullTool implements Tool {
  is_drawing: boolean;
  pts: Point[];

  constructor(){
    this.is_drawing = false;
    this.pts = [];
  }
  active_draw(_srf: Surface, _curr_pt: Point): void {
      console.log("NullTool used active_draw");
  }
  inactive_draw(_srf: Surface): void {
    console.log("NullTool used inactive_draw");
  }
  onPointerDown(_event: FederatedPointerEvent, _srf: Surface): void {
    console.log("NullTool used onPointerDown");
  }
  onPointerUp(_event: FederatedPointerEvent, _srf: Surface): void {
    console.log("NullTool used onPointerUp");
  }
  onPointerMove(_event: FederatedPointerEvent, _srf: Surface): void {
    console.log("NullTool used onPointerMove");
  }
}

export class DrawDots implements Tool {
  is_drawing: boolean;
  pts: Point[];
  dot_radius: number;
  events: Array<(event: FederatedPointerEvent) => void>;

  constructor(){
    this.is_drawing = false;
    this.pts = [];
    this.dot_radius = 5;
    this.events = [];
  }

  active_draw(srf: Surface): void {
    if (this.pts.length == 0){ 
      return
    }
    const last_pt = this.pts[this.pts.length - 1];
    srf.active.circle(last_pt.x, last_pt.y, this.dot_radius);
    srf.active.fill(srf.store.getColorHex());
  }

  inactive_draw(srf: Surface): void {
    if (this.pts.length == 0){ 
      return
    } 

    this.pts.forEach(pt => {
      srf.history.circle(pt.x, pt.y, this.dot_radius);
      srf.history.fill(srf.store.getColorHex());
    });
  }

  onPointerDown(_event: FederatedPointerEvent, srf: Surface): void {
    if (!this.is_drawing){
      this.is_drawing = true;

      //store references to events that persist through tool use
      if (this.events.length == 0){
        this.events.push((event: FederatedPointerEvent) => this.onPointerMove(event, srf));
      }

      //register events
      srf.base.on('pointermove', this.events[0]);
      srf.base.once('pointerup', (event) => this.onPointerUp(event, srf));
      srf.base.once('pointerupoutside', (event) => this.onPointerUp(event, srf));
    }
  }
  
  onPointerUp(_event: FederatedPointerEvent, srf: Surface): void {
    if (this.is_drawing){
      this.inactive_draw(srf)
      srf.active.clear();
      srf.marker.clear();

      this.pts = [];
      this.is_drawing = false;
      srf.base.off('pointermove', this.events[0]);
    }
  }

  onPointerMove(event: FederatedPointerEvent, srf: Surface): void {
    if (this.is_drawing) {
      this.pts.push(new Point(event.globalX, event.globalY));
      this.active_draw(srf);
    }
  }

}

export class LassoFill implements Tool{
  is_drawing: boolean;
  pts: Point[];
  marker_size: number;
  is_dragging: boolean;
  events: Array<(event: FederatedPointerEvent) => void>;

  constructor(){
    this.is_drawing = false;
    this.is_dragging = false;
    this.pts = [];
    this.marker_size = 20;
    this.events = [];
  }
  
  private ptDistSquared(start_pt: Point, end_pt: Point): number{
    const d_x = end_pt.x - start_pt.x;
    const d_y = end_pt.y - start_pt.y;
    return Math.pow(d_x,2) + Math.pow(d_y,2)
  }

  active_draw(srf: Surface): void {
    const num_pts = this.pts.length;
    if (num_pts == 1){ 
      return
    }

    // If not enough points to draw a preview triangle, draw a line instead
    const last_pt = this.pts[this.pts.length - 1];
    if (num_pts == 2){
      srf.active
        .moveTo(this.pts[0].x, this.pts[0].y)
        .lineTo(last_pt.x, last_pt.y)
        .stroke({ color: srf.store.getColorHex(), pixelLine: true, width: 1});
      return
    }
    
    //draw a preview triangle
    if (num_pts == 3){
      
      //Try to prevent errors from buffer being to small?
      const dist = this.ptDistSquared(this.pts[1], last_pt);
      if ( dist < 0.1){
        return
      }
     
      srf.active
        .moveTo(this.pts[0].x, this.pts[0].y)
        .lineTo(this.pts[1].x, this.pts[1].y)
        .lineTo(last_pt.x, last_pt.y)
        .closePath()
        .fill(srf.store.getColorHex());
    }
  }

  inactive_draw(srf: Surface): void {
    
    if (this.pts.length == 3){
      srf.history
        .moveTo(this.pts[0].x, this.pts[0].y)
        .lineTo(this.pts[1].x, this.pts[1].y)
        .lineTo(this.pts[2].x, this.pts[2].y)
        .closePath()
        .fill(srf.store.getColorHex());
        return
    }
    
    console.log("LassoFill inactive_draw called with", this.pts.length, "points");    
  }

  onPointerDown(event: FederatedPointerEvent, srf: Surface): void {
    const curr_pt = new Point(event.globalX, event.globalY);
    this.pts.push(curr_pt);

    if (!this.is_drawing){
      this.is_drawing = true;

      // Init point marker
      srf.marker
        .circle(this.pts[0].x, this.pts[0].y, this.marker_size)
        .stroke({ color: 0xFFFFFF, pixelLine: true, width: 1})
      ;

      // Store a reference to the onMove, onUp events and then register them
      if (this.events.length == 0){
        this.events.push((event: FederatedPointerEvent) => this.onPointerMove(event, srf));
        this.events.push((event: FederatedPointerEvent) => this.onPointerUp(event, srf));
      }
      srf.base.on('pointermove', this.events[0]);
      srf.base.on('pointerup', this.events[1]);
      return
    }

    if (this.is_drawing){
      
      // If we havent accumulated enough points to start drawing triangles yet
      if (this.pts.length < 3){
        srf.active.clear();
        this.active_draw(srf);
      }

      // If we have enough points for a triangle
      if (this.pts.length == 3){
        srf.active.clear();
        this.inactive_draw(srf);
        const last_pt = this.pts[this.pts.length - 1];
        this.pts = [this.pts[0], last_pt];
        this.active_draw(srf);
      }
      
      // Check if we just clicked in the marker
      const distSquared = this.ptDistSquared(this.pts[0], curr_pt);
      if (distSquared < Math.pow(this.marker_size, 2)){
        //Clean up the tool state
        srf.marker.clear();
        this.pts = [];
        this.is_drawing = false;

        // Unregister the stored events
        srf.base.off('pointermove', this.events[0]);
        srf.base.off('pointerup', this.events[1]);
        return
      }
    }
  }

  onPointerUp(_event: FederatedPointerEvent, _srf: Surface): void {
    this.is_dragging = false;
  }

  onPointerMove(event: FederatedPointerEvent, srf: Surface): void {
    this.pts.push(new Point(event.globalX, event.globalY));

    if (!this.is_dragging){
      srf.active.clear();
      this.active_draw(srf);
      this.pts.pop()
    }
  }
}