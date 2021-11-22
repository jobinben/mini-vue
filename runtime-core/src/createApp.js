function createApp(rootComponent) {
    return {
        mount(selector) {
            const container = document.querySelector(selector)
            let isMount = false
            let oldVnode = null

            watchEffect(() => {
                if (!isMount) {
                    oldVnode = rootComponent.render()
                    mount(oldVnode, container)
                    isMount = true
                } else {
                    const newVnode = rootComponent.render()
                    patch(oldVnode, newVnode)
                    oldVnode = newVnode
                }
            })
        }
    }
}