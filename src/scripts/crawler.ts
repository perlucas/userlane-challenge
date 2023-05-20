import commandLineArgs, { OptionDefinition } from 'command-line-args'
import Schema from 'validate'
import { runCrawler } from '../crawler'
import { isValidUrl } from '../crawler/utils'

const validators = {
    url: (aUrl: string | null) => {
        if (aUrl === null) {
            return true
        }

        return isValidUrl(aUrl)
    },

    headerTag: (tag: string | null) => tag === null || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag),

    format: (f: string) => ['json', 'csv'].includes(f)
}

const optionDefinitions: OptionDefinition[] = [
    { name: 'url', alias: 'u', type: String },
    { name: 'words', type: String, multiple: true, defaultValue: [] },
    { name: 'domain', type: String, defaultValue: null },
    { name: 'headerTag', type: String, defaultValue: null },
    { name: 'format', alias: 'f', type: String, defaultValue: 'json' },
    { name: 'depth', alias: 'd', type: Number, defaultValue: 0 }
]

const optionsSchema = new Schema({
    url: {
        type: String,
        required: true,
        use: { url: validators.url }
    },
    domain: {
        type: String,
        required: false,
        use: { url: validators.url }
    },
    headerTag: {
        type: String,
        required: false,
        use: { validTag: validators.headerTag }
    },
    format: {
        type: String,
        required: true,
        use: { validFormat: validators.format }
    },
    depth: {
        type: Number,
        required: true,
        length: {
            min: 0,
            max: 10
        }
    }
})

const run = async () => {

    const options = commandLineArgs(optionDefinitions)

    const errors = optionsSchema.validate({ ...options })

    if (errors.length > 0) {
        throw new Error()
    }
    const result = await runCrawler({
        depth: options.depth,
        outputFormat: options.format,
        scanHeaderTagOnly: options.headerTag,
        mainUrl: options.url,
        matchingWords: options.words,
        scanDomainOnly: options.domain
    })

    return result
}

run()
    .then(result => {
        console.log(result)
    })
    .catch(err => {
        console.log('An error occurred when running this command, check the provided arguments')
        console.error(err)
    })
    .finally(process.exit)