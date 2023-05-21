import commandLineArgs, { OptionDefinition } from 'command-line-args'
import Schema from 'validate'
import { runCrawler } from '../crawler'
import { isValidUrl } from '../crawler/utils'
import commandLineUsage, { Section } from 'command-line-usage'

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

const usageInstructions = () => {
    const sections: Section[] = [
        {
            header: 'Text Web Crawler',
            content: 'Web Crawler for header tags scanning'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'url',
                    description: 'Main website URL',
                    alias: 'u',
                    typeLabel: '{underline site url}',
                    type: String
                },
                {
                    name: 'format',
                    alias: 'f',
                    description: 'Output format',
                    type: String,
                    defaultValue: 'json',
                    typeLabel: '{underline json|csv}'
                },
                {
                    name: 'depth',
                    description: 'How deep should the crawling go',
                    type: Number,
                    defaultValue: 0,
                    alias: 'd',
                    typeLabel: '{underline n}'
                },
                {
                    name: 'headerTag',
                    description: 'Scan only this header tags',
                    type: String,
                    typeLabel: '{underline tag}'
                },
                {
                    name: 'domain',
                    description: 'Scan only this domain\'s links recursively',
                    type: String,
                    typeLabel: '{underline url}'
                },
                {
                    name: 'words',
                    description: 'Filter only results containing these words',
                    multiple: true,
                    type: String,
                    typeLabel: '{underline word} ...'
                }
            ]
        },
    ]

    return commandLineUsage(sections)
}

const run = async () => {

    const options = commandLineArgs(optionDefinitions)

    const errors = optionsSchema.validate({ ...options })

    if (errors.length > 0) {
        throw new Error('validation error')
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
        // console.error(err)
        console.log(usageInstructions())
    })
    .finally(process.exit)