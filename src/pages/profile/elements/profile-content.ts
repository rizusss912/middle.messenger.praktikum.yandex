import {playAnimation} from '../../../utils/animation/animation-utils/play-animation';
import {HideAnimation} from '../../../utils/animation/animations/hide-animation';
import {ShowAnimation} from '../../../utils/animation/animations/show-animation';
import {CustomHTMLElement} from '../../../utils/component';
import {hideElement, showElement} from '../../../utils/functions/hide-element';
import {hiddenWithAnimtionValue} from '../page-profile';

enum profileContentAttributes {
    hiddenWithAnimtion = 'hidden-with-animtion',
}

export class ProfileContent implements CustomHTMLElement {
    private element: HTMLElement;
    private isInitHiddenStatus: boolean = true;

    public onRendered(element: HTMLElement): void {
    	this.element = element;
    }

    protected static get observedAttributes(): string[] {
    	return [profileContentAttributes.hiddenWithAnimtion];
    }

    public onAttributeChanged(
    	name: string,
    	_oldValue: string | null,
    	newValue: string | null,
    ): boolean {
    	switch (name) {
    		case profileContentAttributes.hiddenWithAnimtion:
    			if (_oldValue === newValue) {
    				return false;
    			}

    			if (this.isInitHiddenStatus) {
    				this.isInitHiddenStatus = false;
    				if (newValue === hiddenWithAnimtionValue.false) {
    					showElement(this.element);
    				} else {
    					hideElement(this.element);
    				}

    				return false;
    			}

    			if (newValue === hiddenWithAnimtionValue.false) {
    				this.show();
    			} else {
    				this.hide();
    			}

    			return false;
    		default: return false;
    	}
    }

    private hide(): void {
    	playAnimation(this.element, new HideAnimation());
    }

    private show(): void {
    	playAnimation(this.element, new ShowAnimation());
    }
}