tree
  1.tree-node.js  line:131 this.tree.$emit('check-change', this.node.data, checked, indeterminate,this.node);
  当check-change的时候,将当前的node对象emit出去,便于操作
message-box
  1.message-box/src/main.js
  点击Modal部分不会关闭
input
  1.input.js line:134 this.$emit("onEnterUp");
  将enter键的up事件emit出去,供外部使用:
  example:@onEnterUp
table
  1.table-column.js line:308 if (!value && parent.$props.emptyContent && column.property)
  防止某些无属性的单元变为默认为空样式,如 checkbox变为 --
