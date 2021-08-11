import { Store } from "../../store/store";

describe('Google', () => {

    beforeAll(async () => {
        await page.goto('https://google.com');
    })

    it('should display "google" text on page', async () => {
        await page.evaluate(() => {
            document.body.innerHTML = '';

            document.body.appendChild(document.createElement('random-element-name-for-test'));
        });

        const hasElement = await page.evaluate(() => Boolean(document.body.querySelector('random-element-name-for-test')));

        expect(hasElement).toEqual(true);
    })

    it('', async () => {
        const store: Store = new Store();

        expect(store.state).not.toBeNull();
    })
})