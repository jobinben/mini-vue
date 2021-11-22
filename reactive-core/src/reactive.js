// 依赖收集器
const Dep = {
    subscriber: new Set(),

    addEffect(effect){
        this.subscriber.add(effect)
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

const doubleCounter = () => {
    console.log(info.counter * 2)
}

const powerCounter = () => {
    console.log(info.counter * info.counter)
}

// 手动收集依赖
dep.addEffect(doubleCounter)
dep.addEffect(powerCounter)

info.counter++

// 触发通知
dep.notify() 