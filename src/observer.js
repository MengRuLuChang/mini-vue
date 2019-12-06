/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:41:09 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-06 16:46:03
 */
/* 给data中的所有数据添加getter 和 setter  */
class Observer {
  constructor(data) {
    this.data = data

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
      this.defineReactive(data, key, data[key])
      this.walk(data[key])
    })
  }

  //数据劫持
  defineReactive(obj, key, value) {
    let that = this
    Object.defineProperty(obj, key, {
      enumerable: true, //可枚举
      configurable: true, //可遍历
      get() {
        return value
      },
      set(newValue) {
        if (value = newValue) return
        value = newValue
        //如果newValue是一个对象，也应该对她进行劫持
        that.walk(newValue)


        //需要调用watch update的方法

      }

    })
  }
}