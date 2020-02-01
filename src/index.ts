import Editor from './editor';
import Clear from './plugins/clear';
import Fonts from './plugins/fonts';
import FullScreen from './plugins/fullScreen';
import Header from './plugins/header';
import Image from './plugins/Image';
import Link from './plugins/link';
import Logger from './plugins/logger';
import ModeToggle from './plugins/modeToggle';
import Table from './plugins/table';

// 注册默认插件
Editor.use(Header);
Editor.use(Fonts);
Editor.use(Table);
Editor.use(Image);
Editor.use(Link);
Editor.use(Clear);
Editor.use(Logger);
Editor.use(ModeToggle);
Editor.use(FullScreen);

// 导出声明
export { PluginComponent, PluginProps } from './plugins/Plugin';
// 导出实用工具
export { default as getDecorated } from './utils/decorate';
// 导出工具组件
export { default as DropList } from './components/DropList/index';

// 导出编辑器
export default Editor;
