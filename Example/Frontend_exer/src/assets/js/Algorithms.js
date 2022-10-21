let nums = []
const a1 = new Promise(res => {
    setTimeout(() => {
        nums.push(`a`)
        res(`a`)
    }, 2000)
})

const a2 = new Promise((res, rej) => {
    setTimeout(() => {
        nums.push(`a1`)
        res(`a1`)
    }, 2000)
})

const a3 = new Promise(res => {
    setTimeout(() => {
        nums.push(`a2`)
        res(`a2`)
    }, 2000)
})

const arr = [a1, a2, a3]

arr.reduce(async (pre, next) => {
    await pre
    return next
}, Promise.resolve()).then(res => {
    console.log(nums)
})