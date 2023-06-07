const {normalizeURL, getURLsFromHTML} = require('./crowl');
const {test, expect} = require('@jest/globals');

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeURL strip capitals', () => {
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute ', () => {
    const inputHTMLBody = `
        <html lang="en">
            <body>
                <a href="https://blog.boot.dev/path/">
                    Boot Dev Blog
                </a>
            </body>
        </html>
     `;
    const inputBaseURL = 'https://blog.boot.dev';

    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative ', () => {
    const inputHTMLBody = `
        <html lang="en">
            <body>
                <a href="/path/">
                    Boot Dev Blog 
                </a>
            </body>
        </html>
     `;
    const inputBaseURL = 'https://blog.boot.dev';

    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both ', () => {
    const inputHTMLBody = `
        <html lang="en">
            <body>
                <a href="https://blog.boot.dev/path1/">
                    Boot Dev Blog Path One
                </a>
                <a href="/path2/">
                    Boot Dev Blog Path Two 
                </a>
            </body>
        </html>
     `;
    const inputBaseURL = 'https://blog.boot.dev';

    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid ', () => {
    const inputHTMLBody = `
        <html lang="en">
            <body>
                <a href="invalid">
                    Invalid URL
                </a>
            </body>
        </html>
     `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected)
})
