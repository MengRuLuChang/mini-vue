/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:09 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-09 15:23:04
 */
/* 给data中的所有数据添加getter 和 setter  */
class Observer {
  constructor(data) {
    this.data = data

    this.walk(data)

  }

  /* 核心方法
    遍历data中所有的数据，都添加上getter和setter
  */
  walk(data) {
    if (!data || typeof data != "object") {
      return
    }
    Object.keys(data).forEach(key => {
      //给data中的key添加getter和setter
      console.log('key', key)

      this.defineReactive(data, key, data[key])

      //复杂类型 递归
      this.walk(data[key])
    })
  }

  //定义响应式的数据  数据劫持
  //data中的每一个数据都应该维护一个dep对象
  //dep保存了所有的订阅了该数据的对象

  defineReactive(obj, key, value) {
    let that = this
    let dep = new Dep()

    Object.defineProperty(obj, key, {
      enumerable: true, //可枚举
      configurable: true, //可遍历
      get() {
        // 如果Dep,target中有watcher对象，存储到订阅者数组中
        Dep.target && dep.addSub(Dep.target)
        console.log("我得到了值", value)
        return value
      },
      set(newValue) {
        if (value === newValue) return
        value = newValue
        console.log("我设置了值", value)

        //如果newValue是一个对象，也应该对她进行劫持
        that.walk(newValue)
        //需要调用watch update的方法
        dep.notify()
      }

    })
  }
}