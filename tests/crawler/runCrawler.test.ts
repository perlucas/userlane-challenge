import { JSDOM } from 'jsdom'
import { runCrawler } from '../../src/crawler'

const htmlMockedDOM = {
    ['http://test1.com']: `<!DOCTYPE html>
    <body>
        <p>Hello world</p>
        <h1>Test1 - H1</h1>
        <div>Should be ignored</div>
        <h2>Test1 - H2</h2>
        <div>Should be ignored</div>
        <h3>Test1 - H3</h3>
        <ul>
            <li><h4>Test1 - H4</h4></li>
        </ul>
        <a href="http://test2.com">Go to Test2</a>
    </body>
    `,

    ['http://test2.com']: `<!DOCTYPE html>
    <body>
        <p>Hello world</p>
        <h1>Test2 - H1</h1>
        <div>Should be ignored</div>
        <h2>Test2 - H2</h2>
        <div>Should be ignored</div>
        <h3>Test2 - H3</h3>
        <ul>
            <li><h5>Test2 - H5</h5></li>
            <li><h6>Test2 - H6</h6></li>
        </ul>
        <a href="http://test3.com">Go to Test3</a>
        <a href="http://test4.com">Go to Test4</a>
    </body>
    `,

    ['http://test3.com']: `<!DOCTYPE html>
    <body>
        <p>Hello world</p>
        <h1>Test3 - H1</h1>
        <div>Should be ignored</div>
        <h2>Test3 - H2</h2>
        <div>Should be ignored</div>
        <h3>Test3 - H3</h3>
        <ul>
            <li><h5>Test3 - H5</h5></li>
            <li><h6>Test3 - H6</h6></li>
        </ul>
    </body>
    `,

    ['http://test4.com']: `<!DOCTYPE html>
    <body>
        <p>Hello world</p>
        <h1>Test4 - H1</h1>
        <div>Should be ignored</div>
        <h2>Test4 - H2</h2>
        <div>Should be ignored</div>
        <h3>Test4 - H3</h3>
        <ul>
            <li><h5>Test4 - H5</h5></li>
            <li><h6>Test4 - H6</h6></li>
        </ul>
    </body>
    `,

}

jest.mock('../../src/crawler/dom', () => ({
    buildDOMFromUrl: (url: string) => {
        /* @ts-ignore */
        const dom = new JSDOM(htmlMockedDOM[url])
        return dom.window.document
    }
}))

describe('run Crawler tests', () => {

    test('default configs', async () => {

        const output = await runCrawler({
            depth: 0,
            mainUrl: 'http://test1.com',
            matchingWords: [],
            outputFormat: 'json',
            scanDomainOnly: null,
            scanHeaderTagOnly: null
        })

        expect(
            JSON.parse(output)
        ).toEqual({
            result: [
                {
                    url: 'http://test1.com',
                    words: [
                        'Test1 - H1',
                        'Test1 - H2',
                        'Test1 - H3',
                        'Test1 - H4'
                    ]
                }
            ]
        })

    })

})