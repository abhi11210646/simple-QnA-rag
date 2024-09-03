import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

// load data
const loader = new PDFLoader("./doc.pdf");
const data = await loader.load()

// splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 0,
});
const splitedDocs = await splitter.splitDocuments(data);

export default splitedDocs;