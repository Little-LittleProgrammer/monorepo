// store.ts
import type {App} from 'vue';
import {createPinia} from 'pinia';

import { IMenuData } from '@q-front-npm/types/vue/router';

export interface IBreadcrumb {
    id: string;
    name: string;
    path: string;
    pid: string;
    title: string
}

export interface sysModuleState {
    mainMenuData: IMenuData[]; // 顶部主导航数据
    asideMenuData: IMenuData[]; // 侧边栏导航数据
    initMenuData: string; // 默认地址
    menuDataLoadingEnd: boolean; // 加载导航数据
    formatRouteList: Record<string, IBreadcrumb>
}

const store = createPinia();

export function setup_store(app:App) {
    app.use(store);
}

export { store };