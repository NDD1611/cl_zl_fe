export const checkLeapYear = (year) => {
    let intYear = parseInt(year)
    if (((intYear % 4 === 0) && (intYear % 100 !== 0)) || (intYear % 400 === 0)) {
        return true
    } else {
        return false
    }
}

