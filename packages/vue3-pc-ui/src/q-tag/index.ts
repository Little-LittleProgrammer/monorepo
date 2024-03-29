import Tag from './src/tag.vue';
import type {TagProps} from './src/tagTypes';

import { component_with_install } from '@quantum-design/utils';
const QTag = component_with_install(Tag);

export type {TagProps};
export default QTag;
