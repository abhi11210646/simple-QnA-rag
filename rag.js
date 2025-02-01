import 'dotenv/config'

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables';
import vectorStore from './vectorStore.js';
import { TEMPLATE } from './prompt.js';

// import { ChatOllama } from "@langchain/ollama";

// const llm = new ChatOllama({
//     "baseUrl": "https://llama3.ai.groupone.dev/",
//     "model": "llama3.1:latest"
// })

const convertDocsToString = (documents) => {
    console.log("documents..", documents.length);
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n");
};

const retriever = vectorStore.asRetriever(5);

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

export default async function (message) {
    return await answerRetriever.invoke({
        question: message.content
    });
}