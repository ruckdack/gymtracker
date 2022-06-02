export default class Row extends Map<string, string | number> {
    public getNumber(key: string) {
        let entry = this.get(key)
        return typeof entry === 'number' ? entry : 0
    }

    public getString(key: string) {
        let entry = this.get(key)
        return typeof entry === 'string' ? entry : ''
    }

    // for debugging
    public toString() {
        let s = ''
        for (let [key, value] of this) {
            s += `${key}: ${value}, `
        }
        return s
    }
}
