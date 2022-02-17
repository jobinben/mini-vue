// practice 

// 创建一个依赖器 用发布订阅者模式

class Dep {

    constructor() {
        // 存放我们的依赖函数
        this.subscribe = new Set()
    }

    // 依赖存在时，收集订阅者
    depend(effect) {
        this.subscribe.add(effect)
    }

    // 发布 通知
    notice() {
        this.subscribe.forEach(fn => fn())
    }
}


// 通过defineProperty()进行拦截

function reactive(raw) {
    Object.keys(raw).forEach( key => {

        let val = raw[key]

        Object.defineProperty(raw, key, {

            get() {
                console.log('get: ', val)
                return val
            },

            set(newValue) {
                if(val !== newValue) {
                    val = newValue
                    console.log(val)
                }
            }
        })
    })
}

function reactiveProxy(raw) {
    console.log(raw)
    return new Proxy(raw, {
        get(target, key) {
            console.log('proxy get:', target[key])
            return target[key]
        },
        set(target, key, newValue) {
            if(target[key] !== newValue) {
                console.log('proxy set', newValue)
                target[key] = newValue
            }
        }
    })
}


const dep = new Dep()




// test data

let info = {
    name: 'jobin',
    age: 18
}

const watchEffect01 = () => {
    console.log('1: ', info.name)
}

const watchEffect02 = () => {
    console.log('2: ', info.age)
}


// 收集依赖
dep.depend(watchEffect01)
dep.depend(watchEffect02)


info.age = 20

dep.notice()

// reactive(info)

// 把info对象代理到person对象
const person = reactiveProxy(info)
person.name

