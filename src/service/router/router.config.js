import PageMain from '../../pages/main/page-main.js';
import PageAuth from '../../pages/auth/page-auth.js';
import PageError from '../../pages/error/page-error.js';
import PageProfile from '../../pages/profile/page-profile.js';
import PageSettings from '../../pages/settings/page-settings.js'
import PageDefault from '../../pages/default/page-default.js';

//TODO: Суперсущность. Если будут роуты второго+ порядка, то стоит декомпозировать
export const routerConfig = {
    "/": PageMain,
    "/auth": PageAuth,
    "/error": PageError,
    "/profile": PageProfile,
    "/settings": PageSettings,
    "default": PageDefault,
}