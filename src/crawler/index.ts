import { CrawlerTask } from "./crawlerTask";
import { buildFormatter } from "./formatters";
import { CommandOptions, CommandResult, TaskContainer } from "./types";

export const runCrawler = async (options: CommandOptions): Promise<string> => {

    const result = new CommandResult()

    let depth = options.depth

    const taskManager = new TaskContainer()
    taskManager.addTask(new CrawlerTask(options.mainUrl, taskManager))

    while (depth >= 0) {
        const thisIterationTasks = taskManager.getAllTasks()

        taskManager.removeAllTasks()

        for (const aTask of thisIterationTasks) {
            await aTask.run(options, result)
        }

        depth--
    }

    return buildFormatter(options.outputFormat)
        .format(result)
}