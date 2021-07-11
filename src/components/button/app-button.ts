import {Component, CustomHTMLElement} from '../../utils/component';

import {template} from './app-button.tmpl';

import './app-button.less';

@Component<AppButton>({
    name: 'app-button',
    template, 
})
export class AppButton implements CustomHTMLElement {
}
