/*
 * @Author: your name
 * @Date: 2020-07-30 16:47:35
 * @LastEditTime: 2020-08-25 13:20:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-project/cli3-antd-single-project/src/main.js
 */
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/antd';
import '@/assets/style/global.scss';
Vue.config.productionTip = false;

import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

process.env.NODE_ENV === 'production' && Sentry.init({
    Vue,
    dsn: '',
    release: process.env.VUE_APP_RELEASE_VERSION,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing()
    ],
    sampleRate: 1.0
});

// 修复页面前进后退功能
// if (window.history && window.history.pushState) {
//     window.addEventListener('popstate', function(e) {
//         window.location.reload();
//     }, false);
// }

router.beforeEach((to, from, next) => {
    // 设置是否有历史地址
    if (from.path != '' && from.path != '/' && !store.state.global.hasHistoryUrl){
        store.commit('SET_HISTORY_URL', true);
    }
    // 切换页面后loading清楚
    if (store.state.global.dataLoading){
        store.commit('SET_DATA_LOADING_STATUS', false);
    }
    if (store.state.global.pageLoading){
        store.commit('SET_PAGE_LOADING_STATUS', false);
    }
    document.title = to.meta.title;
    next();
});


router.afterEach((to, from, next) => {
    // document.title = to.meta.title
    // next()
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
