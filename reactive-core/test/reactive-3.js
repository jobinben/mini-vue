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

// Map({key: value}) : key 是一个字符串
// WeakMap({key(对象): value}) : key 是一个对象，弱引用 方便垃圾回收 
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


// vue2对raw(原始数据)进行数据劫持
function reactive(raw) {
    // 遍历key
    Object.keys(raw).forEach(key => {
        const dep = getDep(raw, key)
        let value = raw[key]
        // 对每个属性进行劫持
        Object.defineProperty(raw, key, {
            get() {
                dep.depend() // 触发到Getter函数就收集对应依赖
                return value
            },
            set(newValue) {
                if (value !== newValue) {
                    value = newValue
                    dep.notify() // 触发通知
                }
            }
        })

    })

    // 返回原始数据
    return raw
}



// 测试代码
const info = reactive({
    age: 10,
    name: 'jobin'
})

const bar = reactive({
    counter: 18
})

// watchEffect 1
watchEffect(() => {
    // info.counter 触发到Getter函数 对应的counter属性下的depend() 收集这个函数
    // info.name 也触发到Getter函数 对应的name属性下的depend() 收集这个函数
    console.log('watchEffect 1: ', info.age * 2, info.name)
})

// watchEffect 2
watchEffect(() => {
    console.log('watchEffect 2: ', info.age * info.age, info.name)
})

// watchEffect 3
watchEffect(() => {
    console.log('watchEffect 3: ', info.name)
})

// watchEffect 4
watchEffect(() => {
    // bar.age 触发到Getter函数 对应的age属性下的depend() 收集这个函数
    console.log('watchEffect 4: ', bar.counter)
})

// test 1
info.age++

// test 2
// info.name = 'dabing'

// test 3
// bar.counter = 21


/**
 * 当触发到getter函数时，对应的key下的dep()就会收集这些触发它的函数。
 * 只要执行到watchEffect函数，里面有变量触发到getter函数，就收集当前watchEffect的回调函数。
 */