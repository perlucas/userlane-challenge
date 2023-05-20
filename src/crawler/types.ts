export interface Task {
    run(options: CommandOptions, result: CommandResult): Promise<void>
}

export interface CommandOptions {
    depth: number,
    mainUrl: string,
    format: string,
    headerTag: string | null,
    words: string[]
}

export interface ResultByUrl {
    url: string,
    words: string[]
}

export class CommandResult {
    private wordsByUrl: Map<string, string[]>

    constructor() {
        this.wordsByUrl = new Map()
    }

    addFindings(url: string, findings: string[]) {
        this.wordsByUrl.set(url, findings)
    }

    getAllFindings(): ResultByUrl[] {
        const result: ResultByUrl[] = []
        const entries = this.wordsByUrl.entries()
        for (const [url, words] of entries) {
            result.push({ url, words })
        }
        return result
    }
}

export interface ResultFormatter {
    format(result: CommandResult): string
}

export class TaskContainer {
    private tasks: Task[]

    constructor() {
        this.tasks = []
    }

    addTask(t: Task) {
        this.tasks.push(t)
    }

    getAllTasks(): Task[] {
        return [...this.tasks]
    }

    removeAllTasks() {
        this.tasks = []
    }
}