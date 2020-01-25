import Editor from './editor';
import Clear from './plugins/clear';
import Fonts from './plugins/fonts';
import Header from './plugins/header';
import Link from './plugins/link';
import Logger from './plugins/logger';
import Upload from './plugins/upload';

// 注册默认插件
Editor.use(Header);
Editor.use(Fonts);
Editor.use(Upload);
Editor.use(Link);
Editor.use(Clear);
Editor.use(Logger);

// 导出声明
export { PluginComponent, PluginProps } from './plugins/Plugin';

// 导出编辑器
export default Editor;
