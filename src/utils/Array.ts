const flatten = <T>(arr: (T[])[] | T[]): T[] => {
    let flattened: T[] = [];

    arr.forEach((item) => {
        if (Array.isArray(item)) {
            flattened = flattened.concat(flatten(item));
        } else {
            flattened.push(item);
        }
    });

    return flattened;
}

export {
    flatten
}