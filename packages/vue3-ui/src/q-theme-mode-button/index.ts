
import ThemeModeButton from './themeModeButton.vue';
import type {ThemeModeTypes} from './themeModeButtonTypes';

export type {ThemeModeTypes};

import { withInstall } from '@qmfront/utils';

const QThemeModeButton = withInstall(ThemeModeButton);
export {QThemeModeButton as default};
