/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:02 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-09 16:24:39
 */

/* 定义一个类，用于创建vue实例 */
class Vue {
  constructor(options = {}) {
    // 给vue实例添加属性
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods


    // 监视data中的数据
    new Observer(this.$data)

    //把data中的所有数据都代理到vm上
    this.proxy(this.$data)

    //把methods中所有的数据代理到vm上
    this.proxy(this.$methods)



    if (this.$el) {
      //compile 负责解析模板的内容
      let c = new Compile(this.$el, this)

    }
  }

  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}