import { ExtractPropTypes } from 'vue';
import { propTypes } from '@q-front-npm/types/vue/types';

export const iconPickProps = {
    value: propTypes.string,
    width: propTypes.string.def('100%'),
    pageSize: propTypes.number.def(84)
};
export type IconPickProps = ExtractPropTypes<typeof iconPickProps>