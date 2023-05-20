import { CommandOptions, CommandResult, Task, TaskContainer } from "./types";
import { buildDOMFromUrl } from './dom'
import { isValidUrl } from "./utils";

export class CrawlerTask implements Task {
    constructor(
        private url: string,
        private taskContainer: TaskContainer
    ) { }

    async run(options: CommandOptions, result: CommandResult): Promise<void> {
        const document = await buildDOMFromUrl(this.url)

        const findings = this.findWords(document, options)
        result.addFindings(this.url, findings)

        const urlsToVisit = this.findLinks(document, options)
        for (const url of urlsToVisit) {
            this.taskContainer.addTask(
                new CrawlerTask(url, this.taskContainer)
            )
        }
    }

    private findWords(document: Document, options: CommandOptions): string[] {
        const headerNodes: Element[] = []

        const { scanHeaderTagOnly, matchingWords } = options

        if (scanHeaderTagOnly) {
            document.querySelectorAll(`${scanHeaderTagOnly}`)
                .forEach(n => headerNodes.push(n))
        } else {
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
                .map(t => document.querySelectorAll(t))
                .forEach(nodeSet => {
                    nodeSet.forEach(n => headerNodes.push(n))
                })
        }

        const findings = headerNodes
            .map(hn => hn.textContent || '')
            .filter(text => {
                return matchingWords.length === 0 ||
                    matchingWords.some(w => text?.includes(w))
            })

        return findings
    }

    private findLinks(document: Document, options: CommandOptions): string[] {
        const result: string[] = []

        const { scanDomainOnly } = options

        document.querySelectorAll('a')
            .forEach(anchor => result.push(anchor.href))

        return result.filter(url => url !== null &&
            url !== undefined &&
            url !== ''
        )
            .filter(url => scanDomainOnly === null ||
                url.startsWith(scanDomainOnly)
            )
            .filter(isValidUrl)
    }
}