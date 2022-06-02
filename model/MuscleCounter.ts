import { gcd } from './Helper'

export class MuscleCounter extends Map<number, [number, string]> {
    public isEmpty() {
        return this.size === 0
    }

    public getCount(key: number) {
        const [count, _] = this.get(key) ?? [0, '']
        return count
    }

    public getCountersSum() {
        let sum = 0
        for (let key of this.keys()) {
            sum += this.getCount(key)
        }
        return sum
    }

    public set_(key: number, [value, content]: [number, string]) {
        if (value === 0) {
            this.delete(key)
        } else {
            this.set(key, [value, content])
        }
    }

    public map(
        func: (key: number, value: [number, string], index?: number) => any
    ) {
        return Array.from(this).map(([key, value], index) =>
            func(key, value, index)
        )
    }

    public normalizeRatio() {
        const sum = this.getCountersSum()
        let minGcd = Math.min(...this.map((_, [ratio, __]) => gcd(sum, ratio)))
        this.forEach(([ratio, name], key) => {
            this.set(key, [ratio / minGcd, name])
        })
    }
}
