const complexSortBy = <T, K extends keyof T>(arr: T[], prop: K): T[] => {
    return arr.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
}

export {
    complexSortBy
}