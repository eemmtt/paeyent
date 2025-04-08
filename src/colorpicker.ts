import { Application, Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";


export class ColorPicker{
    base: Container;
    handle: Graphics;
    palette: Graphics;
    is_moving: boolean;

    constructor(app: Application, init_pos: Point){

        this.is_moving = false;

        this.base = new Container();
        this.base.x = init_pos.x;
        this.base.y = init_pos.y;

        this.handle = new Graphics();
        this.handle.eventMode = 'static';
        this.handle.rect(0, 0, 20, 100);
        this.handle.fill(0xFFFF88);
        this.handle.on('pointerdown', this.dragStart, this);
        
        this.palette = new Graphics();
        this.palette.eventMode = 'static';
        this.palette.rect(20, 0, 400, 100);
        this.palette.fill(0xcccccc);
        
        this.base.addChild(this.handle, this.palette);
    }

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

}
