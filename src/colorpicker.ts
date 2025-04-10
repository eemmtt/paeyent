import { Application, Color, Container, FederatedPointerEvent, Graphics, Point, Rectangle } from "pixi.js";
import { Surface } from "./surface";
import { Store } from "./store";

class Slider{
    parent: ColorPicker;
    base: Container;
    line: Graphics;
    slide: Graphics;
    value: number;

    constructor( x: number, y: number, width: number, height: number, slider_color: Color, parent: ColorPicker){
        this.value = 0.5;
        this.parent = parent;

        this.base = new Container();
        this.base.hitArea = new Rectangle(0,0,width,height * 3);
        this.base.eventMode = 'static';

        this.line = new Graphics();
        this.line.rect(0,height/2,width,1);
        this.line.fill(0x222222);
        
        this.slide = new Graphics();
        this.slide.rect(0,0,width,height);
        this.slide.fill(slider_color);
        this.slide.scale = new Point(.5, 1);

        this.base.on('pointerdown', this.pickStart, this);
        this.base.addChild(this.line, this.slide);
        this.base.x = x;
        this.base.y = y;
    }

    private pickStart(this: Slider, event: FederatedPointerEvent){
        //console.log("this: ", this.base.toLocal(event.global).x / this.base.width);
        //console.log('event: ', event);
        const slider_pos = this.base.toLocal(event.global).x / this.base.width;
        this.slide.scale = new Point(slider_pos, 1);
        this.value = slider_pos;
        this.parent.onSliderUpdate();
    }

}

export class ColorPicker{
    base: Container;
    store: Store;
    //handle: Graphics;
    palette: Graphics;
    slider_r: Slider;
    slider_g: Slider;
    slider_b: Slider;
    surface: Surface;
    is_moving: boolean;

    constructor(app: Application, surface: Surface, init_pos: Point, store: Store){

        this.is_moving = false;
        this.surface = surface;
        this.store = store;
        this.base = new Container();
        
        /*
        this.handle = new Graphics();
        this.handle.eventMode = 'static';
        this.handle.rect(0, 0, 20, 100);
        this.handle.fill(0xFFFF88);
        this.handle.on('pointerdown', this.dragStart, this);
        */
        
        this.palette = new Graphics();
        this.palette.eventMode = 'static'
        const v_width = app.screen.width;
        const palette_width = (v_width - 2*init_pos.x) / 2;
        const palette_height = 70;
        this.palette.rect(0, 0, palette_width, palette_height);
        this.palette.fill(0x8F8F8F);

        this.slider_r = new Slider(
            palette_width * 0.1, 
            palette_height / 4, 
            palette_width * 0.8, 
            6, 
            new Color( {r: 248, g: 32, b:32, a:1} ),
            this
        );
        this.slider_g = new Slider(
            palette_width * 0.1, 
            2 * palette_height / 4, 
            palette_width * 0.8, 
            6, 
            new Color( {r: 32, g: 248, b:32, a:1} ),
            this
        );
        this.slider_b = new Slider(
            palette_width * 0.1, 
            3 * palette_height / 4, 
            palette_width * 0.8, 
            6, 
            new Color( {r: 32, g: 32, b:248, a:1}),
            this
        );
        
        //this.base.addChild(this.handle, this.palette);
        this.base.addChild(this.palette, this.slider_r.base, this.slider_g.base, this.slider_b.base);
        this.base.x = init_pos.x;
        this.base.y = init_pos.y;

    }

    public onSliderUpdate(){
        this.store.setColor({
            r: this.slider_r.value,
            g: this.slider_g.value,
            b: this.slider_b.value
        })
    }

    /*
    private dragStart(this: ColorPicker) {
        //console.log(this);
        if (!this.is_moving){
            this.base.parent.on('pointermove', this.dragMove, this);
            this.is_moving = true;
        } else {
            this.base.parent.off('pointermove', this.dragMove, this);
            this.is_moving = false;
        }
    }

    private dragMove(this: ColorPicker, event: FederatedPointerEvent){
        //todo: calculate offset from global pos
        if (this.is_moving){
            this.base.x = event.globalX;
            this.base.y = event.globalY;
        }
    }
    */

}
