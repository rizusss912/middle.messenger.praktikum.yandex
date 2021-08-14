import { RouterService, urlParams } from "./router.service";
import * as sinon from "sinon";
import { AsyncUtils } from "../../utils/test/async-utils";
import { pages } from "./pages.config";
import { Subscription } from "../../utils/observeble/subscription";

enum firstQueryParamsValue {
    firstValue = 'firstValue',
    secondValue = 'secondValue',
}

type testQueryParams = {
    firstParam: firstQueryParamsValue,
}

describe('service: RouterService', () => {
    let routerService: RouterService<testQueryParams>;

    const popstateStub = sinon.stub();
    const queryParamsStub = sinon.stub();
    const pathStub = sinon.stub();

    let popstateSubscription: Subscription<urlParams<testQueryParams>>;
    let queryParamsSubscription: Subscription<testQueryParams>;
    let pathSubscription: Subscription<string>;

    beforeEach(() => {
        routerService = new RouterService<testQueryParams>();

        popstateSubscription = routerService.$popstate.subscribe(popstateStub);
        queryParamsSubscription = routerService.$queryParams.subscribe(queryParamsStub);
        pathSubscription = routerService.$path.subscribe(pathStub);
    });

    afterEach(() => {
        popstateSubscription.unsubscribe();
        queryParamsSubscription.unsubscribe();
        pathSubscription.unsubscribe();

        popstateStub.reset();
        queryParamsStub.reset();
        pathStub.reset();
    });

    describe('$popstate', () => {
        it('not called when subscribing', async () => {
            await AsyncUtils.waitAllTasksInEventLoop();
            expect(popstateStub.notCalled).toBe(true);
        });

        it('gets the value every time navigateTo() is called', async () => {
            const callCount = popstateStub.callCount;

            routerService.navigateTo();
            routerService.navigateTo();
            routerService.navigateTo(pages.main, {firstParam: firstQueryParamsValue.firstValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(popstateStub.callCount).toBe(callCount + 3);
        });

        it('default value', async () => {
            routerService.navigateTo();
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(
                popstateStub.calledWith({
                    pathname: '/',
                    queryParams: {},
                    hash: '',
                })
            ).toBe(true);
        });

        it('custom value', async () => {
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.secondValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(
                popstateStub.calledWith({
                    pathname: pages.profile,
                    queryParams: {firstParam: firstQueryParamsValue.secondValue},
                    hash: 'hash',
                })
            ).toBe(true);
        });
    })

    describe('$queryParams', () => {
        it('called when subscribing', async () => {
            await AsyncUtils.waitAllTasksInEventLoop();
            expect(queryParamsStub.calledOnce).toBe(true);
        });

        it('is not gets value if the params has not changed', async () => {
            routerService.navigateTo(pages.main, {firstParam: firstQueryParamsValue.firstValue});
            await AsyncUtils.waitAllTasksInEventLoop();

            const callCount = queryParamsStub.callCount;

            routerService.navigateTo(pages.auth, {firstParam: firstQueryParamsValue.firstValue});
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.firstValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(queryParamsStub.callCount).toBe(callCount);
        });

        it('default value', async () => {
            routerService.navigateTo();
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(queryParamsStub.lastCall.calledWith({})).toBe(true);
        });

        it('custom value', async () => {
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.secondValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(
                queryParamsStub.lastCall.calledWith({firstParam: firstQueryParamsValue.secondValue})
            ).toBe(true);
        });
    });

    describe('$path', () => {
        it('called when subscribing', async () => {
            await AsyncUtils.waitAllTasksInEventLoop();
            expect(pathStub.calledOnce).toBe(true);
        });

        it('is not gets value if the path has not changed', async () => {
            routerService.navigateTo(pages.profile);
            await AsyncUtils.waitAllTasksInEventLoop();

            const callCount = pathStub.callCount;

            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.firstValue});
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.secondValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(pathStub.callCount).toBe(callCount);
        });

        it('default value', async () => {
            routerService.navigateTo();
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(pathStub.lastCall.calledWith(pages.main)).toBe(true);
        });

        it('custom value', async () => {
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.secondValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(pathStub.lastCall.calledWith(pages.profile)).toBe(true);
        });
    });

    describe('urlParams', () => {
        it('default value', async () => {
            routerService.navigateTo();
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(routerService.urlParams).toEqual({
                pathname: '/',
                queryParams: {},
                hash: '',
            });
        });

        it('custom value', async () => {
            routerService.navigateTo(pages.profile, {firstParam: firstQueryParamsValue.secondValue}, 'hash');
            await AsyncUtils.waitAllTasksInEventLoop();

            expect(routerService.urlParams).toEqual({
                pathname: pages.profile,
                queryParams: {firstParam: firstQueryParamsValue.secondValue},
                hash: 'hash',
            });
        });
    });
});