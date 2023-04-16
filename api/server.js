import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message:
            "This is ChatGPT AI APP server url, please visit https://chatgpt-ai-app-od21.onrender.com",
    });
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// let chatHistory = [];
app.post("/", async (req, res) => {
    try {
        // const input = req.body.input;

        // Retrieve the most recent response from the chat history
        // const lastResponse = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].bot : "";

        // Build the prompt by concatenating the current input with the last response
        // const prompt = `${lastResponse} ${input}`;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.input,
            // prompt,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log("PASSED: ", req.body.input);

        // Store the current input and response in the chat history
        // chatHistory.push({ input: input, bot: response.data.choices[0].text });
        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.log("FAILED:", req.body.input);
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(4000, () => console.log("Server is running on port 4000"));
