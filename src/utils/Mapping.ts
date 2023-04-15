const linearMapping = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
    ): number => {
    const t = (value - inMin) / (inMax - inMin)
    return outMin + t * (outMax - outMin)
}

const getLinearMapper = (
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
) => (value: number) => linearMapping(
    value,
    inMin,
    inMax,
    outMin,
    outMax
)

export {
    linearMapping,
    getLinearMapper
}
