import { Application, Rectangle, Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Store } from "./store";
import { Tool } from "./tools";

interface ButtonListener {
    curr_tool: Tool;
    onButtonUpdate: () => void;
}

export class Button{
    base: Container;
    backgrounds: Graphics[];
    bg_index: number;
    listeners: ButtonListener[];

    constructor(_app: Application, _store: Store, rect: Rectangle){
        
        this.listeners = [];
        this.base = new Container();
        this.base.eventMode = 'static'

        const inset =  _app.screen.width * (1 - _store.inset);
        const new_rect = new Rectangle(
            rect.x - inset * 0.8, 
            rect.y, 
            rect.width - inset * 0.2, 
            rect.height - 0.25 * inset
        )

        this.base.hitArea = new_rect;

        const bg_dots = new Graphics()
            .roundRect(new_rect.x, new_rect.y, new_rect.width, new_rect.height, 3)
            .fill(0x8F8F8F)
            //.ellipse(new_rect.x + new_rect.width/2, new_rect.y + new_rect.height/2, new_rect.width/4, new_rect.height/4)
            //.stroke({color: 0xDDDDDD, pixelLine: true, width: 1})
            ;
        const bg_lasso = new Graphics()
            .ellipse(new_rect.x + new_rect.width/2, new_rect.y + new_rect.height/2, new_rect.width/2, new_rect.height/2)
            .fill(0x8F8F8F)
            //.roundRect(new_rect.x + new_rect.width/4, new_rect.y + new_rect.height/4, new_rect.width/2, new_rect.height/2, 1)
            //.stroke({color: 0xDDDDDD, pixelLine: true, width: 1})
            ;
        bg_dots.visible = false;

        this.backgrounds = [bg_lasso, bg_dots];
        this.bg_index = 0;

        this.base.addChild(this.backgrounds[0], this.backgrounds[1]);
        this.base.on('pointerdown', (_event: FederatedPointerEvent) => this.onButtonPress());
    }

    public registerButtonListener(listener: ButtonListener){
        this.listeners.push(listener);
    }

    public onButtonPress(){
        this.backgrounds[this.bg_index].visible = false;
        this.backgrounds[(this.bg_index + 1) % this.backgrounds.length].visible = true;
        this.bg_index = (this.bg_index + 1) % this.backgrounds.length;

        this.listeners.forEach(listener => {
            listener.onButtonUpdate();
        })
    }
}