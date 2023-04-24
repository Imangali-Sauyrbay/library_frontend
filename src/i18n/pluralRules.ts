const slavicPlural = (choice: number, choicesLength: number) => {
    if (choice === 0) {
        // If the number is 0, it's usually considered singular.
        return 0
    }

    const isTeen = choice > 10 && choice < 20
    const endsWithOne = choice % 10 === 1

    if (!isTeen && endsWithOne) {
        // If the number ends in 1 (but is not a teen number), it's usually singular.
        return 1
    }

    const endsWithTwoToFour = choice % 10 >= 2 && choice % 10 <= 4
    if (!isTeen && endsWithTwoToFour) {
        // If the number ends in 2-4 (but is not a teen number), it's usually dual.
        return 2
    }

    if (choicesLength < 4) {
        // If there are fewer than 4 choices, use the dual form.
        return 2
    } else {
        // Otherwise, use the plural form.
        return 3
    }
}

export {
    slavicPlural
}