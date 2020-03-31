import layer from './src/layer.js'

//import 'packages/layer/src/css/index.css';

// 为组件提供 install 安装方法，供按需引入
layer.install = function (Vue) {
  Vue.component('layer', layer);
}

// 默认导出组件
export default layer;
