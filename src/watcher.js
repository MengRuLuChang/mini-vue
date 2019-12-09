/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:13 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-09 15:07:51
 */
/* watcher模块负责把compile 模块与observer模块关联起来 */
class Watcher {
  //vm 当前vue实例
  //expr data中的数据名字
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    //  this表示的就是新创建的watcher对象
    //存储到Dep，target属性上、
    Dep.target = this
    //需要把expr的旧值给存储起来
    this.oldValue = this.getVMValue(vm, expr)

    //clear Dep.target
    Dep.target = null

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

//  Dep对象用于管理所有的订阅者和通知这些订阅者
class Dep {
  constructor() {
    //用于管理订阅者
    this.sub = []
  }

  //添加订阅者、
  addSub(watcher) {
    this.sub.push(watcher)
  }

  //通知
  notify() {
    //遍历所有的订阅者，调用watcher和update方法
    this.sub.forEach(sub => {
      sub.update()
    })
  }
}