// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { check_status } from './check-status';
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@wuefront/shared/enums';
import { deep_merge, isString } from '@wuefront/utils';
import { joinTimestamp, joinEnvToUrl, joinCookieToUrl, dealToken } from './helper';
import { useMessage } from '@wuefront/hooks/vue';

const { createMessage } = useMessage();

const error = createMessage.error!;
const {joinTokenToHeader, setTokenToHeader} = dealToken();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const defaultTransform: AxiosTransform = {

    /**
     * 发送请求前
     * @param config
     * @param options
     */
    beforeRequestHook: (config, options) => {
        const { apiUrl, urlPrefix, joinTime = true, env = () => '', joinPrefix, joinCookie = true } = options;
        const params = config.params || {};
        const data = config.data || false;

        if (!(config.url?.match(/^http/) != null || config.url?.match(/^\/\//) != null)){
            if (joinPrefix) {
                config.url = `${urlPrefix}${config.url}`;
            }
            if (apiUrl && isString(apiUrl)) {
                config.url = `${apiUrl}${config.url}`;
            }
        }

        // 处理时间戳
        if (config.method?.toUpperCase() === RequestEnum.GET) {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinEnvToUrl(env, false), joinTimestamp(joinTime, false), joinCookieToUrl(joinCookie, false));
            } else {
                // 兼容restful风格
                config.url = config.url + params + '?' + `${joinTimestamp(joinTime, true)}&` + `${joinEnvToUrl(env, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                config.params = undefined;
            }
        } else {
            if (!isString(params)) {
                config.url = config.url + '?' + `${joinTimestamp(joinTime, true)}&` + `${joinEnvToUrl(env, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
                    config.data = Object.assign(data || {}, joinEnvToUrl(env, false));
                    config.params = params;
                } else {
                    // 非GET请求如果没有提供data，则将params视为data
                    config.data = Object.assign(params || {}, joinEnvToUrl(env, false));
                    config.params = undefined;
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params + '?' + `${joinTimestamp(joinTime, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                config.params = undefined;
                config.data = joinEnvToUrl(env, true);
            }
        }
        return config;
    },
    /**
   * @description: 请求拦截器处理
   */
    requestInterceptors: (config, options) => {
        if (options.customTransform && options.customTransform.customRequest) {
            config = options.customTransform.customRequest(config) as SelectPartial<AxiosRequestConfig<any>, 'url' | 'headers' | 'method'>;
            config = joinTokenToHeader(options.requestOptions?.joinToken || true, config) as SelectPartial<AxiosRequestConfig<any>, 'url' | 'headers' | 'method'>;
        }
        return config;
    },

    /**
     * @description: 请求拦截器错误处理
     * @param error
     */
    requestInterceptorsCatch: (error: any, options) => {
        if (options.customTransform && options.customTransform.customRequestError) {
            options.customTransform.customRequestError(error);
        }
        if (error && error.response) {
            check_status(error.response?.status, '连接错误', error.config?.requestOptions?.errorMessageMode || 'message');
        } else {
            check_status('400', '连接到服务器失败', error.config?.requestOptions?.errorMessageMode || 'message');
        }
        return Promise.reject(error.response);
    },

    /**
   * @description: 响应拦截器处理
   */
    responseInterceptors: (res: AxiosResponse<any>, options) => {
        if (options.customTransform && options.customTransform.customResponse) {
            res = options.customTransform.customResponse(res);
        }
        if (res.data.code == ResultEnum.NOTFOUND){
            location.replace('/backend/error');
        } else if (res.data.code == ResultEnum.ERROR){
            error(res.data.msg);
        } else if (res.data.code == ResultEnum.SERVERERROR){
            error(res.data.msg);
        } else if (res.data.code == ResultEnum.RELOAD){
            setTokenToHeader(options.requestOptions?.joinToken || true, res);
            window.location.reload();
        } else if (res.data.code == ResultEnum.LOGIN){
            window.location.href = res.data.data?.url;
        } else if (res.data.code == ResultEnum.TIMEOUT) {
            error('请求超时');
        }
        return res;
    },

    /**
   * @description: 响应错误处理
   */
    responseInterceptorsCatch: (error: any, options) => {
        if (options.customTransform && options.customTransform.customResponseError) {
            options.customTransform.customResponseError(error);
        }
        if (error && error.response) {
            check_status(error.response?.status, '连接错误', error.config?.requestOptions?.errorMessageMode || 'message');
        } else if (error.code === 'ERR_CANCELED') {
            // 如果手动取消, 不予受理
            console.log('请求重复, 手动取消请求');
            return Promise.resolve(error);
        } else {
            check_status('400', '连接到服务器失败', error.config?.requestOptions?.errorMessageMode || 'message');
        }
        return Promise.reject(error.response);
    }
};

export function createAxios(opt?: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'>) {
    return new VAxios(
        deep_merge(
            {
                // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
                // authentication schemes，e.g: Bearer
                // authenticationScheme: 'Bearer',
                authenticationScheme: '',
                timeout: 60 * 1000,
                // 基础接口地址
                // baseURL: env.apiUrl,
                // 接口可能会有通用的地址部分，可以统一抽取出来
                // urlPrefix: import.meta.env.VITE_GLOB_API_URL,
                headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
                defaultTransform,
                customTransform: {},
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    //  是否加入时间戳
                    joinTime: true,
                    // 是否在请求中加入环境参数
                    env: () => '',
                    // 是否加入cokie
                    joinCookie: true,
                    // 忽略重复请求
                    cancelToken: true,
                    // 是否携带token
                    // withToken: true,
                    // 消息提示类型
                    errorMessageMode: 'message',
                    // 接口地址
                    apiUrl: '',
                    uploadUrl: '',
                    joinToken: true, // 是否在header中加入token
                    // 接口拼接地址
                    urlPrefix: 'api'
                }
            },
            opt || {}
        )
    );
}

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });