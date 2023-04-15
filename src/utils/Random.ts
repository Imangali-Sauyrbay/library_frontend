
const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min)
}

const randomFloat = (min: number, max: number): number => {
    return (Math.random() * (max - min)) + min
}

/**
 * Attention!
 * This func is slow!
 * Because of it takes all the values from min to max and pushes them into array.
 * The numbers in subranges will be pushed {weight} times into the arrey.
 * The result is random value from weightedArray.
 * 
 * @param min minimal value
 * @param max maximum value
 * @param subrangeMin subrange min value
 * @param subrangeMax subrange max value
 * @param weight how many times subrange values should be repeated in array
 * @return {number} random float
 */
const getRandomWeighted = (
    min:number,
    max:number,
    subrangeMin:number,
    subrangeMax:number,
    weight: number
): number => {
    const weightedArray: number[] = []

    for (let i = min; i <= max; i++) {
        const repetitions = (i >= subrangeMin && i <= subrangeMax) ? weight : 1
        for (let j = 0; j < repetitions; j++) {
            weightedArray.push(i)
        }
    }

    return weightedArray[Math.floor(Math.random() * weightedArray.length)]
}

const getRandomWithProbability = (
    min: number,
    max: number,
    subrangeMin: number,
    subrangeMax: number,
    probability: number
): number => {
    const subrangeWidth = subrangeMax - subrangeMin
    const subrangeProbability = subrangeWidth * probability
    const remainingWidth = (max - min) - subrangeWidth
    const totalProbability = subrangeProbability + remainingWidth

    const randomValue = Math.random() * totalProbability

    if (randomValue < subrangeProbability) {
        return (randomValue / probability) + subrangeMin
    } else {
        const adjustedValue = randomValue - subrangeProbability
        const result = adjustedValue + min
        return (result < subrangeMin) ? result : result + subrangeWidth
    }
}

type Subrange = {
    range: [number, number],
    probability: number
}

type RandValue<T> = {
    value: T
    probability: number
}

const getRandomValueByProbability = <T>(values: RandValue<T>[]): T => {
    const totalProbability = values.reduce((acc, curr) => acc + curr.probability, 0)
    const randomProbability = Math.random() * totalProbability

    let cumulativeProbability = 0

    for (const value of values) {
    
        cumulativeProbability += value.probability

        if (randomProbability <= cumulativeProbability) {
            return value.value
        }
    }

    console.warn('fallback in function getRandomValueByProbability')
    return values[0].value
}

const getRandomValueFromRanges = (subranges: Subrange[]): number => {
    const totalProbability = subranges.reduce((acc, curr) => acc + curr.probability, 0)
    const randomProbability = Math.random() * totalProbability

    let cumulativeProbability = 0

    for (const subrange of subranges) {
    
        cumulativeProbability += subrange.probability

        if (randomProbability <= cumulativeProbability) {
            const [min, max] = subrange.range
            return (Math.random() * (max - min)) + min
        }
    }

    // fallback
    console.warn('fallback in function getRandomValueFromRanges')
    const randRange = subranges[random(0, subranges.length)]
    return randomFloat(randRange.range[0], randRange.range[1])
}

export {
    random,
    randomFloat,
    getRandomWeighted,
    getRandomWithProbability,
    getRandomValueFromRanges,
    getRandomValueByProbability,
    type Subrange,
    type RandValue
}
