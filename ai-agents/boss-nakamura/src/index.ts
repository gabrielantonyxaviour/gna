import { Request, Response, route } from './httpSupport';

// In-memory store for chat histories, keyed by session ID
const chatHistories: { [sessionId: string]: { role: string, content: string }[] } = {};

async function GET(req: Request): Promise<Response> {
    const secrets = req.secret || {};
    const queries = req.queries;
    const apiKey = secrets.apiKey || 'sk-nypg8jmdw5GgFVRN3MzHGmMhBxxSXpQiwy4wGqVBEa1vL79W';

    // Default values for model and query
    const model = queries.model ? queries.model[0] : 'gpt-4o';
    const chatQuery = queries.chatQuery ? queries.chatQuery[0] : 'Who are you?';
    const sessionId = queries.sessionId ? queries.sessionId[0] : 'default';

    let result = {
        message: ''
    };

    // Initialize chat history for the session if not already present
    if (!chatHistories[sessionId]) {
        chatHistories[sessionId] = [
            {
                role: "system",
                content: `1.) Your name is Boss Nakamura - an Expert in DeFi and your job is to assist the users with DeFi based questions
                2.) Keep your responses concise and upto the point AND DO NOT YAP!`
            }
        ];
    }

    // Append the user's message to the chat history
    chatHistories[sessionId].push({
        role: "user",
        content: chatQuery
    });

    try {
        // Send the entire chat history in the request body to the Redpill API
        const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: chatHistories[sessionId],
                model: model,
                n: 1,
                temperature: 0.7,  // Adjusted for more consistent responses
                max_tokens: 300    // Increased token limit for more detailed responses
            })
        });

        const responseData = await response.json();

        // Extract message content from the API response
        const messageContent = responseData.choices[0].message?.content;

        // Append the model's response to the chat history
        if (messageContent) {
            chatHistories[sessionId].push({
                role: "assistant",
                content: messageContent
            });

            result.message = messageContent;

            // Limit the chat history to the last 10 messages to prevent excessive token usage
            if (chatHistories[sessionId].length > 11) { // 11 because we want to keep the system message
                chatHistories[sessionId] = [
                    chatHistories[sessionId][0],
                    ...chatHistories[sessionId].slice(-10)
                ];
            }
        } else if (responseData.error) {
            result.message = responseData.error.message || "An error occurred";
        } else {
            result.message = "Unexpected response format";
        }
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result.message = "An error occurred while fetching the response";
    }

    return new Response(JSON.stringify(result));
}

async function POST(req: Request): Promise<Response> {
    return new Response(JSON.stringify({ message: 'POST Not Implemented' }));
}

export default async function main(request: string) {
    return await route({ GET, POST }, request);
}