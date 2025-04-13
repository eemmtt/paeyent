import { Color } from "pixi.js";

interface RGBA {
    r: number; // 0-1
    g: number; // 0-1
    b: number; // 0-1
    a?: number; // 0-1 (optional, defaults to 1)
}

interface ColorListener {
    onColorUpdate: (store: Store) => void;
}

export class Store{
    red: number;
    green: number;
    blue: number;
    colorListeners: ColorListener[];

    inset: number; // 0-1, percentage to shrink panel in layout

    

    constructor(color: {r:number, g:number, b:number}, inset: number){
        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;
        this.colorListeners = [];
        this.inset = inset;
    }

    public getColor(){
        const color = new Color({
            r:this.red, 
            g:this.green, 
            b:this.blue, 
            a:1
        });
        //console.log("Get color: ", color)
        return color
    }

    public getColorRGBA(){
        const color = {
            r:this.red, 
            g:this.green, 
            b:this.blue
        };
        //console.log("Get color: ", color)
        return this.rgbaToHex(color);
    }

    public getColorHex(){
        return this.rgbaToHex({r: this.red, g: this.green, b: this.blue })
    }

    public registerColorListener(listener: ColorListener){
        this.colorListeners.push(listener);
    }

    public setColor(color: {r:number, g:number, b:number}){
        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;
        //console.log("Set color: ", this.red, this.green, this.blue, 1);
        this.colorListeners.forEach(listener => {
            listener.onColorUpdate(this);
        });
    }

    private rgbaToHex({ r, g, b }: RGBA): number {
        const red = Math.max(0, Math.min(255, Math.round(r * 255)));
        const green = Math.max(0, Math.min(255, Math.round(g * 255)));
        const blue = Math.max(0, Math.min(255, Math.round(b * 255)));
        //const alpha = Math.max(0, Math.min(1, a));
        
        const hexStr = (
            (red << 16) | 
            (green << 8) | 
            blue
        ).toString(16).padStart(6, '0');
        
        return parseInt(`0x${hexStr}`, 16);
    }

}