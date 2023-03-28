import { update_theme } from '@/assets/ts/theme';
import setting from '@/enums/projectEnum';
import { MemorialEnum } from '@wuefront/shared/enums';
import { createLocalStorage } from '@wuefront/utils';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {date_util} from '@wuefront/utils';

export interface IFileExport {
    title?: string;
    action: string;
    message: string;
    url: string
}

let timeId: TimeoutHandle;

// state
const createState = () => {
    const state = {
        systemName: '七猫广告',
        theme: 'light' as 'light' | 'dark',
        date: new Date(),
        dataLoading: false,
        pageLoading: false,
        environmentData: { //  环境
            env: '', // 0:测试环境 1:正式环境
            title: ''
        },
        asyncExportNoticePop: { //  下载
            visible: false,
            file: '', //  文件名
            title: '' //  异步查看文件的列表html代码（包含查看链接）
        },
        hasHistoryUrl: false, // 是否有项目历史地址
        authorityManage: false, // 权限管理开关（默认为开启，需要配置相应的数据）
        citySelect: [] as ISelectOption[]
        // projectConfig:
    };
    return state;
};
export type globalState = ReturnType<typeof createState>

export const state = createState();
const ls = createLocalStorage();

export const useGlobalStore = defineStore('global', {
    state: ():globalState => (state),
    getters: {
        getThemeMode(): 'light' | 'dark' {
            return this.theme || ls.get('themeMode') || 'light';
        }
    },
    actions: {
        set_theme_mode(mode: 'light' | 'dark') {
            this.theme = mode;
            ls.set('themeMode', mode);
            let _theme: 'light' | 'dark'|'gray-mode' = this.theme;
            if (setting.theme.grayMode) {
                const _timeNow = this.date;
                console.log('_timeNow', _timeNow);
                type Enum = keyof typeof MemorialEnum
                for (const key in MemorialEnum) {
                    if (date_util(_timeNow).format('MM-DD') == MemorialEnum[key as Enum]) {
                        _theme = 'gray-mode';
                    }
                }
            }
            update_theme(_theme);
        },
        set_project_config(config: any) {
            // 方便以后项目可视化配置
        },
        set_environment_data(data: SelectPartial<globalState['environmentData'], 'env'>) {
            if (this.environmentData.env != '' && parseInt(data.env) != parseInt(this.environmentData.env)){
                window.location.reload();
                return false;
            }
            this.environmentData.env = '' + data.env;
            if (data.env == '0'){
                this.environmentData.title = '测试环境';
            } else if (data.env == '1'){
                this.environmentData.title = '正式环境';
            }
        },
        set_async_export_data(data:IFileExport) {
            if (data.action === 'async') {
                if (data.title) {
                    this.asyncExportNoticePop.title = data.title;
                }
                this.asyncExportNoticePop.file = data.message;
                this.asyncExportNoticePop.visible = true;
            } else if (data.action === 'sync') {
                window.open(data.url, '_blank');
                message.success('导出成功');
            }
        },
        set_page_loading_action(loading:boolean) {
            if (loading) {
                clearTimeout(timeId);
                // Prevent flicker
                timeId = setTimeout(() => {
                    this.pageLoading = loading;
                }, 50);
            } else {
                this.pageLoading = loading;
                clearTimeout(timeId);
            }
        }
    }
});
