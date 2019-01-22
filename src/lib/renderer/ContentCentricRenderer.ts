import {ClassicRenderer} from './ClassicRenderer';
import {IRenderable} from '../api/IRenderable';
import EventStream from '../event/EventStream';
import {Overlay} from '../renderable/overlay';

/**
 * The content centric renderer tries to maximize the time a content is visible by updating
 * the content if possible or displaying interrupting actions like intent cascading by overlaying the content.
 */
export class ContentCentricRenderer extends ClassicRenderer {

    private qualifier = null;
    private behaviour:(renderable:IRenderable, type?:string) => HTMLElement[] = (r, t) => this.defaultBehaviour(r, t);

    constructor(container: HTMLElement) {
        super(container);
        EventStream.addListener("GAIA::publish", (e) => {
            if (e[0].type === "suggestion") {
                this.behaviour = this.suggestionBehaviour(this.qualifier || "");
            }
        });
    }

    protected renderElement(renderable: IRenderable, containerType?: string): HTMLElement[] {
        return this.behaviour(renderable, containerType);
    }

    private static getQualifier(renderable: IRenderable) {
        return (renderable["spec"] !== undefined) ? renderable["spec"].qualifier : null;
    }

    private defaultBehaviour(renderable:IRenderable, containerType?:string) {
        if (!containerType) {
            this.qualifier = ContentCentricRenderer.getQualifier(renderable);
        }
        return super.renderElement(renderable, containerType);
    }

    private suggestionBehaviour(qualifier?:string) {
        return (renderable:IRenderable, containerType?:string) => {
            if (ContentCentricRenderer.getQualifier(renderable) === qualifier) {
                const containers = document.getElementsByClassName("lto-container");
                const containerZ = containers[containers.length - 1];

                if (containerZ.parentElement) {
                    containerZ.parentElement.removeChild(containerZ);
                }

                this.behaviour = (r, t) => this.defaultBehaviour(r, t);
                return super.renderElement(renderable, containerType);
            }
            if (!containerType) {
                return super.renderElement(new Overlay(renderable), "block");
            }
            return super.renderElement(renderable, "block");
        };
    }

}
