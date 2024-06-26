import { createUnplugin } from 'unplugin';
import MagicString from 'magic-string';
import type { NuxtOptions } from '@nuxt/schema';
import { libraryName } from '../config';
import { camelize, gen_side_effects_import } from '../utils';
import type { TransformOptions } from '../types';

interface PluginOptions extends TransformOptions {
    sourcemap?: NuxtOptions['sourcemap']['client']
    transformStyles: (name: string) => undefined | string
}

const componentsRegExp =
  /(?<=[ (])_?resolveComponent\(\s*["'](lazy-|Lazy)?([^'"]*?)["'][\s,]*[^)]*\)/g;

export const transformPlugin = createUnplugin((options: PluginOptions) => {
    const { include, exclude, transformStyles } = options;

    return {
        name: `${libraryName}:transform`,
        enforce: 'post',
        transformInclude(id) {
            if (exclude.some(pattern => id.match(pattern))) {
                return false;
            }
            if (include.some(pattern => id.match(pattern))) {
                return true;
            }
        },
        transform(code, id) {
            const imports = new Set<string>();
            const s = new MagicString(code);

            const addStyles = (style?: string) => {
                style && imports.add(gen_side_effects_import(style));
            };

            s.replace(componentsRegExp, (full, lazy, name) => {
                addStyles(transformStyles(camelize(name)));
                return full;
            });

            if (imports.size) {
                s.prepend([...imports, ''].join('\n'));
            }

            if (s.hasChanged()) {
                return {
                    code: s.toString(),
                    map: options.sourcemap
                        ? s.generateMap({ source: id, includeContent: true })
                        : undefined
                };
            }
        }
    };
});
