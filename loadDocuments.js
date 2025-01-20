import 'dotenv/config'

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";

import vectorStore from "./vectorStore.js";

// load data
const loader = new TextLoader("./data.txt");
const data = await loader.load()

// splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 100,
});
const splitedDocs = await splitter.splitDocuments(data);

await vectorStore.addDocuments(splitedDocs);

console.log("Data loaded successfully");