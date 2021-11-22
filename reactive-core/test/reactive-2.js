// 依赖收集器
const Dep = {
    subscriber: new Set(),

    depend() {
        if (activeEffect) {
            this.subscriber.add(activeEffect)
        }
    },

    notify() {
        this.subscriber.forEach(effect => {
            effect()
        })
    }
}

const dep = Object.create(Dep)

const info = {
    counter: 10
}

let activeEffect = null
const watchEffect = (effect) => {
    activeEffect = effect
    dep.depend() // 收集依赖
    effect()  // 添加默认执行一次依赖
    activeEffect = null
}


watchEffect(function doubleCounter(){
    console.log(info.counter * 2)
})

watchEffect(function  powerCounter() {
    console.log(info.counter * info.counter)
})


info.counter++

// 手动触发通知
dep.notify()