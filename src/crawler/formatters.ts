import { CommandResult, ResultFormatter } from "./types";

export function buildFormatter(format: string): ResultFormatter {
    return new JsonFormatter()
}

class JsonFormatter implements ResultFormatter {
    format(result: CommandResult): string {
        return JSON.stringify({
            result: result.getAllFindings()
        })
    }
}