/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:13 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-06 16:16:07
 */
/* watcher模块负责把compile 模块与observer模块关联起来 */
class Watcher {
  //vm 当前vue实例
  //expr data中的数据名字
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb


    //需要把expr的旧值给存储起来
    this.oldValue = this.getVMValue(vm, expr)

  }

  // 对外暴露一个方法，这个方法用于更新页面
  update() {
    //对比expr是否发生了变化，如果发生了变化，需要调用cb
    let oldValue = this.oldValue
    let newValue = this.getVMValue(this.vm, this.expr)
    if (oldValue != newValue) {
      this.cb(newValue, oldValue)
    }

  }

  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}