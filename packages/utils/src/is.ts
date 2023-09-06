import {gRegEnum} from '@q-front-npm/shared/enums';

const toString = Object.prototype.toString;
function user_agent() {
    return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent || 'server';
}

export function js_is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

export function js_is_def<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function js_is_un_def<T = unknown>(val?: T): val is T {
    return !js_is_def(val);
}

export function js_is_object(val: any): val is Record<any, any> {
    return val !== null && js_is(val, 'Object');
}

export function js_is_empty<T = unknown>(val: T): val is T {
    if (js_is_array(val) || js_is_string(val)) {
        return val.length === 0;
    }

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }

    if (js_is_object(val)) {
        return Object.keys(val).length === 0;
    }

    return false;
}

export function js_is_date(val: unknown): val is Date {
    return js_is(val, 'Date');
}

export function js_is_null(val: unknown): val is null {
    return val === null;
}

export function js_is_null_or_undef(val: unknown): val is null | undefined {
    return js_is_un_def(val) || js_is_null(val);
}

export function js_is_number(val: unknown): val is number {
    return js_is(val, 'Number');
}

export function js_is_promise<T = any>(val: unknown): val is Promise<T> {
    return js_is(val, 'Promise') && js_is_object(val) && js_is_function(val.then) && js_is_function(val.catch);
}

export function js_is_string(val: unknown): val is string {
    return js_is(val, 'String');
}

export function js_is_function(val: unknown): val is Fn {
    return typeof val === 'function';
}

export function js_is_boolean(val: unknown): val is boolean {
    return js_is(val, 'Boolean');
}

export function js_is_reg_exp(val: unknown): val is RegExp {
    return js_is(val, 'RegExp');
}

export function js_is_symbol(val: unknown): val is symbol {
    return js_is(val, 'Symbol');
}

export function js_is_array(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function js_is_window(val: any): val is Window {
    return typeof window !== 'undefined' && js_is(val, 'Window');
}

export function js_is_element(val: unknown): val is Element {
    return js_is_object(val) && !!val.tagName;
}

export function js_is_map(val: unknown): val is Map<any, any> {
    return js_is(val, 'Map');
}

export function js_is_set(val: unknown): val is Set<any> {
    return js_is(val, 'Set');
}

// 是否是基本数据类型
export function js_is_base(val: unknown): boolean {
    // 可遍历的引用类型
    let _flag = !(js_is_map(val) || js_is_set(val) || js_is_array(val) || js_is_object(val));
    // 不可遍历的引用类型
    _flag = _flag && !(js_is_symbol(val) || js_is_reg_exp(val) || js_is_function(val));

    return _flag;
}

// 是否相等
export function js_is_equal<T = unknown>(val1: T, val2: T): boolean {
    // 如果其中有基本类型
    if (js_is_base(val1) || js_is_base(val2)) {
        return val1 === val2;
    }
    // 如果特意传的就是两个指向同一地址的对象
    if (val1 === val2) {
        return true;
    }
    // 两个都是对象或者数组，而且不相等
    const _obj1_keys = Object.keys(val1 as object);
    const _obj2_keys = Object.keys(val2 as object);
    // 先判断长度进行过滤
    if (_obj1_keys.length !== _obj2_keys.length) {
        return false;
    }
    // 以val1为基准，和val2依次递归比较
    for (const key in val1) {
        const res = js_is_equal(val1[key], val2[key]);
        // 如果出现不相等直接返回false
        if (!res) {
            return false;
        }
    }
    return true;
}

export const js_is_server = typeof window === 'undefined';

export const js_is_client = !js_is_server;

export function js_is_url(path: string): boolean {
    const reg = gRegEnum.urlReg;
    return reg.test(path);
}

// 判断文件后缀是否为图片
export function js_is_image(fileName: string): boolean {
    const _types = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
    return _types.some(item => fileName.toLowerCase().includes(item));
}

// 判断文件后缀是否为视频
export function js_is_video(fileName: string): boolean {
    const _types = ['mp4', 'avi', 'wmv', 'mkv', 'mov', 'flv', 'webm'];
    return _types.some(item => fileName.toLowerCase().includes(item));
}

// 判断当前浏览器环境
export function js_is_android(): boolean {
    return /(android|adr|linux)/i.test(user_agent());
}

export function js_is_ios(): boolean {
    return /(iphone|ipad|ipod)/i.test(user_agent());
}

export function js_is_mobile(): boolean {
    return js_is_android() || js_is_ios();
}

export function js_is_iphone(): boolean {
    return /iphone/i.test(user_agent());
}

export function js_is_ipad(): boolean {
    return /ipad/i.test(user_agent());
}

export function js_is_wechat(): boolean {
    return /MicroMessenger/i.test(user_agent());
}

export function js_is_ding_ding(): boolean {
    return /DingTalk/i.test(user_agent());
}

export function js_is_safari_browser(): boolean {
    return /^((?!chrome|android).)*safari/i.test(user_agent());
}

export function js_is_baidu_browser(): boolean {
    return /Baidu/i.test(user_agent());
}
