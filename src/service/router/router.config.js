import PageMain from '../../pages/main/page-main.js';
import PageAuth from '../../pages/auth/page-auth.js';
import PageProfile from '../../pages/profile/page-profile.js';
import PageDefault from '../../pages/default/page-default.js';
import {pages} from './pages.config.js';

//TODO: Суперсущность. Если будут роуты второго+ порядка, то стоит декомпозировать
export const routerConfig = {
    [pages.main]: PageMain,
    [pages.auth]: PageAuth,
    [pages.profile]: PageProfile,
    [pages.default]: PageDefault,
}