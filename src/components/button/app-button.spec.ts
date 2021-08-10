import {AppButton} from './app-button';
import sinon from 'sinon';

describe('app-button', () => {
    const appButton = new AppButton();
    const onDisabledStub = sinon.stub();
    
    appButton.$disabled.subscribe(onDisabledStub);

    it('notifies about the disabled attribute change', () => {
        appButton.onAttributeChanged('disabled', null, '');
        expect(onDisabledStub).toBeCalledWith(true);

        appButton.onAttributeChanged('disabled', '', null);
        expect(onDisabledStub).toBeCalledWith(false);

        
    });

    afterEach(() => {
        onDisabledStub.restore();
    });
})