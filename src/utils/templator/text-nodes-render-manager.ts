import {TextNodeRenderer} from "./text-node-renderer";

export class TextNodesRenderManager<Context extends object> {
    private readonly context: Context;
    private readonly renderers: TextNodeRenderer<Context>[] = [];

    constructor(context: Context) {
        this.context = context;
    }

    public initTextNode(content: string): Text {
        const renderer = new TextNodeRenderer<Context>(content, this.context);
        
        this.renderers.push(renderer);

        return renderer.node;
    }

    public renderAll(context: Context): void {
        for (var renderer of this.renderers) {
            renderer.render();
        }
    }
}