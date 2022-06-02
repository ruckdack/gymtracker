export const gcd = (a: number, b: number) => {
    if (a === 0) return Math.abs(b)
    if (b === 0) return Math.abs(a)
    do {
        const h = a % b
        a = b
        b = h
    } while (b !== 0)
    return Math.abs(a)
}

const formatNumberToXX = (x: number) => (`${x}`.length === 1 ? `0${x}` : `${x}`)

// returns date in YYYY-MM-DD format
export const getDate = () => {
    let d = new Date()
    return `${d.getFullYear()}-${formatNumberToXX(
        d.getMonth() + 1
    )}-${formatNumberToXX(d.getDate())}`
}
