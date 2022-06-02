type Observer = () => void
export default class Observable {
    observers: Observer[]
    constructor() {
        this.observers = []
    }
    subscribe = (observer: Observer) => {
        this.observers.push(observer)
    }
    unsubscribe = (observer: Observer) => {
        this.observers = this.observers.filter(
            (subs: Observer) => subs !== observer
        )
    }
    notify = () => {
        this.observers.forEach((observer: Observer) => observer())
    }
}
