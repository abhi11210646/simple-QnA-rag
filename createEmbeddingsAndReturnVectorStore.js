import { OpenAIEmbeddings } from '@langchain/openai';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';


export default async function (splitedDocs) {

    // OpenAIEmbeddings
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small"
    });
    // vectorstore
    const vectorStore = new MemoryVectorStore(embeddings);
    // add documents
    await vectorStore.addDocuments(splitedDocs);

    return vectorStore;
};