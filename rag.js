import 'dotenv/config'

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables';
import vectorStore from './vectorStore.js';
import { TEMPLATE } from './prompt.js';


const convertDocsToString = (documents) => {
    // console.log("Helloo..", documents);
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n");
};

const retriever = vectorStore.asRetriever();

// const res = await vectorStore.similaritySearch("Lease rental foreclosure or termination?")
// console.log("similaritySearch", res)

const docRetrieverChain = RunnableSequence.from([
    input => input.question,
    retriever,
    convertDocsToString
]);

// LLM
const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo'
});

// Prompt
const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);

const answerRetriever = RunnableSequence.from([
    {
        context: docRetrieverChain,
        question: input => input.question
    },
    prompt,
    llm,
    new StringOutputParser()
])

const result = await answerRetriever.invoke({
    question: "Lease duration?"
})

console.log(result)

process.exit(0);