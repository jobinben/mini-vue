// 实现渲染的h函数
const h = (tag, props, children) => {

    return {
        tag,
        props,
        children
    }
}

const mount = (vnode, container) => {
    // vnode -> element
    // 1. 创建出真实的原生dom，并且在vnode上保留为el
    const el = vnode.el = document.createElement(vnode.tag)

    // 2. 处理props
    if (vnode.props) {
        for( const key in vnode.props) {
            const value = vnode.props[key]

            if(key.startsWith('on')) {
                // 处理监听事件
                // el.addEventListener(key.slice(2).toLowerCase(), value)
                el[key.toLowerCase()] = value
            } else {
                // 设置属性
                el.setAttribute(key, value)
            }

        }
    }

    // 3. 处理children
    if(vnode.children) {
        if(typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach( item => {
                // 递归children
                mount(item, el)
            })
        }
    }

    // 4. 将el挂载到container
    container.appendChild(el)
}
