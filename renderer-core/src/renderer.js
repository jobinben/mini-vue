// 实现渲染的h函数
const h = (tag, props, children) => {

    return {
        tag,
        props,
        children
    }
}

// 挂载函数
const mount = (vnode, container) => {
    // vnode -> element
    // 1. 创建出真实的原生dom，并且在vnode上保留为el
    const el = vnode.el = document.createElement(vnode.tag)

    // 2. 处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]

            if (key.startsWith('on')) {
                // 处理监听事件
                el.addEventListener(key.slice(2).toLowerCase(), value)
                // el[key.toLowerCase()] = value
            } else {
                // 设置属性
                el.setAttribute(key, value)
            }

        }
    }

    // 3. 处理children
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach(item => {
                // 递归children
                mount(item, el)
            })
        }
    }

    // 4. 将el挂载到container
    container.appendChild(el)
}


// patch对比两个结点变化函数
const patch = (n1, n2) => {
    // 先对比标签是否一样 否则直接暴力替换
    if (n1.tag !== n2.tag) {
        const n1Parent = n1.el.parentElement
        n1Parent.removeChild(n1.el)
        mount(n2, n1Parent)
    } else {
        // 1. 取出element对象，并且在n2中进行保存
        const el = n2.el = n1.el

        // 2. 处理props
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        // 2.1 获取所有的newProps添加到el
        for (const key in newProps) {
            // 老的props存在同样的key 但是值不一定相等
            const oldValue = oldProps[key]
            const newValue = newProps[key]
            if (newValue !== oldValue) {
                if (key.startsWith('on')) {
                    // 处理监听事件
                    el.addEventListener(key.slice(2).toLowerCase(), newValue)
                    // el[key.toLowerCase()] = value
                } else {
                    // 设置属性
                    el.setAttribute(key, newValue)
                }
            }

        }

        // 2.2 删除旧的props
        for (const key in oldProps) {

            if (!(key in newProps)) {
                el.removeAttribute(key)
            }
            
            // 如果是事件的话 要移除之前监听的事件
            if (key.startsWith('on')) {
                const value = oldProps[key]
                el.removeEventListener(key.slice(2).toLowerCase(), value)
            }
        }

        // 3. 处理children
        const oldChildren = n1.children || []
        const newChildren = n2.children || []

        if(typeof newChildren === 'string') { // 情况一: newChildren本身是一个string
            // 边缘情况处理 edge case
            if(typeof oldChildren === 'string') {
                if(newChildren !== oldChildren) {
                    el.textContent = newChildren
                }
            } else {
                el.innerHTML = newChildren
            }
        } else { // 情况二: newChildren本身是一个数组
            if(typeof oldChildren === 'string') {
                el.innerHTML = '' // 情况oldchildren的内容
                
                newChildren.forEach( item => { // 挂载newchildren的内容
                    mount(item, el)
                })
            } else {
                // oldChildren: [v1, v2, v3]
                // newChildren: [v4, v5, v6, v7, v8]
                // 1. 前面有相同结点的原生进行patch操作
                const commonLength = Math.min(oldChildren.length, newChildren.length)
                for(let i = 0; i < commonLength; i++) {
                    patch(oldChildren[i], newChildren[i])
                }

                // oldChildren: [v1, v2, v3]
                // newChildren: [v4, v5, v6, v7, v8]
                // 2. newChildren.length > oldChildren.length
                if(newChildren.length > oldChildren) {
                    newChildren.slice(oldChildren.length).forEach(item => {
                        mount(item, el)
                    })
                } 


                // oldChildren: [v1, v2, v3, v4, v5]
                // newChildren: [v6, v7, v8]
                // 3. newChildren.length < oldChildren.length
                if(newChildren.length < oldChildren.length) {
                    oldChildren.slice(newChildren.length).forEach(item => {
                        el.removeChild(item.el)
                    })
                }

            }

        }
    }
}


