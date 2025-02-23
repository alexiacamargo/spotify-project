import { MongoClient } from "mongodb";

const URL = "mongodb+srv://myaccmail00:4fhz0TGpQe7LjJmY@cluster0.wf9p0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(URL);

export const db = client.db("spotifyProject");


