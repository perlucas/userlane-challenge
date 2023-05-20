import { JSDOM } from 'jsdom'

export async function buildDOMFromUrl(url: string): Promise<Document> {
    const { window } = await JSDOM.fromURL(url)

    return window.document
}