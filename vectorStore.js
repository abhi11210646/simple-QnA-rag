import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { MongoClient } from "mongodb";

// OpenAIEmbeddings
const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small"
});
const client = new MongoClient(process.env.MONGODB_URI);
const collection = client
    .db("vectorStore")
    .collection("hrpolicy");
// vector_index: vector index should be created on the collection
// {
//     "fields": [
//       {
//         "numDimensions": 1536,
//         "path": "embedding",
//         "similarity": "cosine",
//         "type": "vector"
//       }
//     ]
//   }
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
});

export default vectorStore;