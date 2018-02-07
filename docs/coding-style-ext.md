# Vue.js 组件编码规范补充

## 文档结构
* [回调函数命名](#回调函数命名)
* 未使用的代码要清理

## 回调函数命名


```html
<!-- 推荐 -->
<el-button type="table" @click="onDetailMerchant(scope.row.id)" size="small">

<!-- 避免 -->
<el-button type="table" @click="detailMerchant(scope.row.id)" size="small">
```
