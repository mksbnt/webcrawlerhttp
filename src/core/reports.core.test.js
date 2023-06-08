const {sortPages} = require('./reports.core');
// const {normalizeURL} = require('./crowl');
const {test, expect} = require('@jest/globals');

test('sortPages 2 pages', () => {
    const input = {
        'https://blog.boot.dev/path1': 1,
        'https://blog.boot.dev/path3': 3,
    };
    const actual = sortPages(input);
    const expected = [
        ['https://blog.boot.dev/path3', 3],
        ['https://blog.boot.dev/path1', 1],
    ];
    expect(actual).toEqual(expected)
})

test('sortPages 5 pages', () => {
    const input = {
        'https://blog.boot.dev/path1': 1,
        'https://blog.boot.dev/path3': 3,
        'https://blog.boot.dev/path9': 9,
        'https://blog.boot.dev/path4': 4,
        'https://blog.boot.dev/path5': 5,
    };
    const actual = sortPages(input);
    const expected = [
        ['https://blog.boot.dev/path9', 9],
        ['https://blog.boot.dev/path5', 5],
        ['https://blog.boot.dev/path4', 4],
        ['https://blog.boot.dev/path3', 3],
        ['https://blog.boot.dev/path1', 1],
    ];
    expect(actual).toEqual(expected)
})
