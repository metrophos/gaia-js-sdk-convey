import {IRenderer, ISpecification, IRenderable, IStackeable} from '../../../api';
import Renderables from '../../Renderables';

/**
 * Implementation of the 'row' markup element.
 */
export class Row implements IRenderable, IStackeable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const row = document.createElement('tr');
        if(this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => row.classList.add(e));
        }
        row.classList.add('lto-row');

        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => row.appendChild(x)));

        return row;
    }

}
Renderables.register("row", Row);
