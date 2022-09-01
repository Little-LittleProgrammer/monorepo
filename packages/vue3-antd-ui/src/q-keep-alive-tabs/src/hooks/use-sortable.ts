
import { isNullAndUnDef } from '@qmfront/shared/utils';
import { useSortable } from '@qmfront/hooks';
import { useTabsStore } from './use-tabs-store';
import { nextTick } from 'vue';
import { ChangeEvent } from '@qmfront/shared/types/global';

// 排序
export function useTabsDrag(affixTextList: string[]) {
    const store = useTabsStore();
    nextTick(() => {
        const el = document.querySelectorAll(`.ant-tabs-nav-wrap > div`)?.[0] as HTMLElement;
        const { initSortable } = useSortable(el, {
            // 过滤, 初始化页面不能移动
            filter: (e) => {
                const text = (e as unknown as ChangeEvent)?.target?.innerText;
                if (!text) return false;
                return affixTextList.includes(text);
            },
            onEnd: (evt) => {
                console.log(evt);

                const { oldIndex, newIndex } = evt;

                if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                    return;
                }

                store.sort_tabs({oldIndex, newIndex});
            }
        });
        initSortable();
    });
}
