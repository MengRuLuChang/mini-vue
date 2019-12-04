/*
 * @Author: ding yipeng 
 * @Date: 2019-12-04 15:40:39 
 * @Last Modified by: ding yipeng
 * @Last Modified time: 2019-12-04 16:23:05
 */
/* 负责解析模板内容 */
class Compile {
  //参数1：模板
  //参数2：vue实例
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    //编辑模板
    if (this.el) {
      //1.把el中所有的子节点都放入到内存中，fragment
      let fragment = this.node2fragment(this.el)

      //2.在内存中编辑fragment
      this.compile(fragment)

      //3.把fragment一次性添加到页面
      this.el.appendChild(fragment)
    }

  }
  /* 核心方法 */
  node2fragment(node) {
    let fragment = document.createDocumentFragment()
    // 把el中的所有子节点全部添加到文档碎片中
    let childNodes = node.childNodes
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node)
    })
    return fragment

  }

  /**
   *编译文档碎片（内存中）
   * @param {*} fragment
   */
  compile(fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node => {
      //编译子节点
      if (this.isElementNode(node)) {
        this.compileElement(node)
        //如果是元素，需要解析指令

      }
      if (this.isTextNode(node)) {
        //如果是文本节点，需要解析插值表达式
        this.compileTextNode(node)

      }
      //如果当前节点还有子节点，就递归解析
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  //解析html标签
  compileElement(node) {
    //1.获取当前节点下的所有属性
    let attributes = node.attributes
    this.toArray(attributes).forEach(attr => {
      //2.解析vue的指令（v-开头的属性）
      let attrName = attr.name
      console.dir(attrName)
      if (this.isDirective(attrName)) {
        let type = attrName.slice(2)
        let expr = attr.value
        //解析v-on指令
        if (this.isEventDirective(type)) {
          CompileUtil['eventHandler'](node, this.vm, type, expr)
        } else {
          //解析指令
          CompileUtil[type] && CompileUtil[type](node, this.vm, expr)
        }
      }
    })
  }

  //解析文本节点
  compileTextNode(node) {
    CompileUtil['mustache'](node, this.vm)
  }

  /* 工具方法 */
  toArray(likeArray) {
    return [].slice.call(likeArray)
  }
  isElementNode(node) {
    // nodeType : 1：元素节点3：文本节点
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isEventDirective(type) {
    return type.split(':')[0] === 'on'
  }
}

let CompileUtil = {
  mustache(node, vm) {
    let txt = node.textContent
    //正则分组（）$1
    let reg = /\{\{(.+)\}\}/
    if (reg.test(txt)) {
      let expr = RegExp.$1
      node.textContent = txt.replace(reg, CompileUtil.getVMValue(vm, expr))
    }
  },
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr)
  },
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr)
  },
  model(node, vm, expr) {
    node.value = this.getVMValue(vm, expr)
  },
  eventHandler(node, vm, type, expr) {
    //给当前元素注册事件

    let eventType = type.split(":")[1]
    let fn = vm.$methods && vm.$methods[expr]
    if (eventType && fn) {
      node.addEventListener(eventType, vm.$methods[expr].bind(vm))
    }
  },
  // 用于获取vm中的数据
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}