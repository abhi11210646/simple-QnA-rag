import 'dotenv/config'

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables';
import vectorStore from './vectorStore.js';
import { TEMPLATE } from './prompt.js';

import { ChatOllama } from "@langchain/ollama";



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
const llm2 = new ChatOpenAI({
    model: 'gpt-3.5-turbo'
});

// LLM 
const llm = new ChatOllama({
    "baseUrl": "https://llama3.ai.groupone.dev/",
    "model": "llama3.1:latest"
})

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
    question: "Who is eligible to take car lease?"
})

console.log(result)

process.exit(0);