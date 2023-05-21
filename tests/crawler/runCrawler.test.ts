import { JSDOM } from 'jsdom'
import { runCrawler } from '../../src/crawler'
import { CommandOptions } from '../../src/crawler/types'

const htmlMockedDOM = {
    ['http://test1.com/']: `<!DOCTYPE html>
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
        <a href="http://test2.com/">Go to Test2</a>
    </body>
    `,

    ['http://test2.com/']: `<!DOCTYPE html>
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
        <a href="http://test3.com/">Go to Test3</a>
        <a href="http://test4.com/">Go to Test4</a>
    </body>
    `,

    ['http://test3.com/']: `<!DOCTYPE html>
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

    ['http://test4.com/']: `<!DOCTYPE html>
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

    const defaultConfig = {
        depth: 0,
        mainUrl: 'http://test1.com/',
        matchingWords: [],
        outputFormat: 'json',
        scanDomainOnly: null,
        scanHeaderTagOnly: null
    }

    test.each([
        {
            description: 'default configs',
            config: {},
            expectedOutput: {
                result: [
                    {
                        url: 'http://test1.com/',
                        words: [
                            'Test1 - H1',
                            'Test1 - H2',
                            'Test1 - H3',
                            'Test1 - H4'
                        ]
                    }
                ]
            }
        },

        {
            description: 'default configs, only H2 tags',
            config: {
                scanHeaderTagOnly: 'h2'
            },
            expectedOutput: {
                result: [
                    {
                        url: 'http://test1.com/',
                        words: [
                            'Test1 - H2'
                        ]
                    }
                ]
            }
        },

        {
            description: 'depth=1, only H1 tags',
            config: {
                scanHeaderTagOnly: 'h1',
                depth: 1
            },
            expectedOutput: {
                result: [
                    {
                        url: 'http://test1.com/',
                        words: [
                            'Test1 - H1'
                        ]
                    },
                    {
                        url: 'http://test2.com/',
                        words: [
                            'Test2 - H1'
                        ]
                    }
                ]
            }
        },

        {
            description: 'depth=2, only domain test2',
            config: {
                scanDomainOnly: 'http://test2.com',
                depth: 2
            },
            expectedOutput: {
                result: [
                    {
                        url: 'http://test1.com/',
                        words: [
                            'Test1 - H1',
                            'Test1 - H2',
                            'Test1 - H3',
                            'Test1 - H4'
                        ]
                    },
                    {
                        url: 'http://test2.com/',
                        words: [
                            'Test2 - H1',
                            'Test2 - H2',
                            'Test2 - H3',
                            'Test2 - H5',
                            'Test2 - H6'
                        ]
                    }
                ]
            }
        },

        {
            description: 'depth=1, only test2 words',
            config: {
                depth: 1,
                matchingWords: ['Test2']
            },
            expectedOutput: {
                result: [
                    {
                        url: 'http://test1.com/',
                        words: []
                    },
                    {
                        url: 'http://test2.com/',
                        words: [
                            'Test2 - H1',
                            'Test2 - H2',
                            'Test2 - H3',
                            'Test2 - H5',
                            'Test2 - H6'
                        ]
                    }
                ]
            }
        },
    ])('should return expected json output (%#)', async ({ config, expectedOutput }) => {
        const output = await runCrawler({
            ...defaultConfig,
            ...config
        })

        expect(JSON.parse(output)).toEqual(expectedOutput)
    })

    test('should format result as CSV', async () => {
        const expectedOutput = `url,text
http://test1.com/,Test1 - H1
http://test1.com/,Test1 - H2
http://test1.com/,Test1 - H3
http://test1.com/,Test1 - H4`

        const output = await runCrawler({
            ...defaultConfig,
            outputFormat: 'csv'
        })

        expect(output).toEqual(expectedOutput)
    })
})