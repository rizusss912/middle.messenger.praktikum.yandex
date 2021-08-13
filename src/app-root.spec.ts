import { pages } from "./service/router/pages.config";
import { HistoryUtils } from "./utils/test/history-utils";
import { PageManager } from "./utils/test/page-manager";

describe('component: app-root', () => {
    const domUtils = new PageManager(page);
    const historyUtils = new HistoryUtils(page);

    beforeAll(async () => {
        await domUtils.open();
    });

    it('has app-root', async () => {
        expect(await domUtils.hasElement('app-root')).toBe(true);
        expect(await domUtils.hasAttribute('app-root', 'hidden')).toBe(false);
    });

    it('has main page', async () => {
        expect(await domUtils.hasElement('page-main')).toBe(true);
        expect(await domUtils.hasAttribute('page-main', 'hidden')).toBe(false);
    });

    describe('content changes when the history changes', () => {
        // pushState не вызывает popstate, поэтому сначала заполняем историю,
        // а потом идём по ней назад через history.back()

        //TODO: Тест флакает, поэтому не дублируем для других страниц
        it('page-auth', async () => {
            await domUtils.open();
            await historyUtils.pushState(pages.auth);
            await historyUtils.back();
            await historyUtils.forward();

            expect(await domUtils.hasElement('page-auth')).toBe(true);
            expect(await domUtils.hasAttribute('page-auth', 'hidden')).toBe(false);
        });
    });
});