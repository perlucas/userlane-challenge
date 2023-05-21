import { CommandResult, ResultFormatter } from "./types";

export function buildFormatter(format: string): ResultFormatter {
    return format === 'csv'
        ? new CsvFormatter()
        : new JsonFormatter()
}

class JsonFormatter implements ResultFormatter {
    format(result: CommandResult): string {
        return JSON.stringify({
            result: result.getAllFindings()
        })
    }
}

class CsvFormatter implements ResultFormatter {
    format(result: CommandResult): string {
        const findings = result.getAllFindings()
        const lines = [
            ['url', 'text']
        ]

        findings.forEach(r => {
            const { url, words } = r

            const wordsToPrint = words.length > 0
                ? words
                : ['']

            wordsToPrint.forEach(w => {
                lines.push([url, w])
            })
        })

        return lines
            .map(l => l.join(','))
            .join('\n')
    }
}