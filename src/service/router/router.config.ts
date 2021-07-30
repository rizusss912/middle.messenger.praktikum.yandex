import {PageMain} from '../../pages/main/page-main';
import {PageAuth} from '../../pages/auth/page-auth';
import {PageProfile} from '../../pages/profile/page-profile';
import {PageDefault} from '../../pages/default/page-default';
import {pages} from './pages.config';

// TODO: Суперсущность. Если будут роуты второго+ порядка, то стоит декомпозировать
export type HTMLPage = PageMain | PageAuth | PageProfile | PageDefault;
export type HTMLPageConstructor = new () => HTMLPage;

export const routerConfig: Record<pages, HTMLPageConstructor> = {
	[pages.main]: PageMain,
	[pages.auth]: PageAuth,
	[pages.profile]: PageProfile,
	[pages.default]: PageDefault,
};
