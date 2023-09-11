
import ThemeModeButton from './src/themeModeButton.vue';
import type {ThemeModeTypes} from './src/themeModeButtonTypes';

export type {ThemeModeTypes};

import { component_with_install } from '@quantum-design/utils';

const QThemeModeButton = component_with_install(ThemeModeButton);
export {QThemeModeButton as default};
