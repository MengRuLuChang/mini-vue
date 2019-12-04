/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:02 
 * @Last Modified by:   ding yipeng 
 * @Last Modified time: 2019-12-04 15:41:02 
 */

/* 定义一个类，用于创建vue实例 */
class Vue {
  constructor(options = {}) {
    // 给vue实例添加属性
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods
    if (this.$el) {
      //compile 负责解析模板的内容
      let c = new Compile(this.$el, this)

    }
  }
}