import { component_with_install } from '@quantum-design/utils';
import breadcrumb from './src/breadcrumb.vue';

export type * from './src/types';

const QAntdBreadcrumb = component_with_install(breadcrumb);

export default QAntdBreadcrumb;

