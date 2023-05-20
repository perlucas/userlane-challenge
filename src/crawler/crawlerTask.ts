import { CommandOptions, CommandResult, Task, TaskContainer } from "./types";
import { buildDOMFromUrl } from './dom'

export class CrawlerTask implements Task {
    constructor(
        private url: string,
        private taskContainer: TaskContainer
    ) { }

    async run(options: CommandOptions, result: CommandResult): Promise<void> {
        const document = await buildDOMFromUrl(this.url)

        const findings = this.findWords(document, options)
        result.addFindings(this.url, findings)

        const urlsToVisit = this.findLinks(document)
        for (const url of urlsToVisit) {
            this.taskContainer.addTask(
                new CrawlerTask(url, this.taskContainer)
            )
        }
    }

    private findWords(document: Document, options: CommandOptions): string[] {
        const { headerTag, words } = options

        const headerNodes: Element[] = []

        if (headerTag) {
            document.querySelectorAll(`${headerTag}`)
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
                return words.length === 0 ||
                    words.some(w => text?.includes(w))
            })

        return findings
    }

    private findLinks(document: Document): string[] {
        const result: string[] = []

        document.querySelectorAll('a')
            .forEach(anchor => result.push(anchor.href))

        return result.filter(url => url !== null &&
            url !== undefined &&
            url !== ''
        )
    }
}