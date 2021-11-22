// 依赖收集器类
// 确保每个依赖器处于独立 不共享数据
class Dep {
    constructor() {
        this.subscriber = new Set()
    }

    depend() {
        if (activeEffect) {
            this.subscriber.add(activeEffect)
        }
    }

    notify() {
        this.subscriber.forEach(effect => {
            effect()
        })
    }
}

let activeEffect = null
const watchEffect = (effect) => {
    activeEffect = effect
    effect()  // 添加默认执行一次依赖
    activeEffect = null
}


/* targetMap = {
    
    {info对象} => { 
        'age' => new Dep(),  
        'name' => new Dep() 
    },

    {bar对象} => {
        'counter' : new Dep()
    }

}
*/
const targetMap = new WeakMap()
function getDep(target, key) {
    // 1. 根据对象(target)取出对应的Map对象
    let depsMap = targetMap.get(target)
    if (!depsMap) { // 对象不存在就创建
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // 2. 取出具体的dep对象
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }

    return dep
}

// vue3用proxy进行数据劫持
function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const dep = getDep(target, key)
            dep.depend() // 收集依赖
            return target[key]
        },
        set(target, key, newValue) {
            const dep = getDep(target, key)
            if (target[key] !== newValue) {
                target[key] = newValue
                dep.notify() // 通知订阅者
            }
        }
    })
}

// export {
//     reactive,
//     watchEffect
// }