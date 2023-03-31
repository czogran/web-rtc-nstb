export function isNullOrUndefined(input: unknown): boolean {
    return input === null || input === undefined
}

export function isEmpty(input: unknown) {
    if (isNullOrUndefined(input)) {
        return true
    }

    if (typeof input === 'string' || Array.isArray(input)) {
        return input.length === 0
    }

    if (typeof input === 'object') {
        return Object.keys(input).length === 0
    }

    return false
}
