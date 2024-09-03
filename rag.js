import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables';

import createEmbeddingsAndReturnVectorStore from './createEmbeddingsAndReturnVectorStore.js';
import splitedDocs from './loadDocumentsAndSplit.js';
import { TEMPLATE } from './constants.js';
import { convertDocsToString } from './helpers.js';

const vectorStore = await createEmbeddingsAndReturnVectorStore(splitedDocs);
const retriever = vectorStore.asRetriever();

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
    question: "what are the benefits of using oauth2?"
})

console.log(result)