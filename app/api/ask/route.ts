
import { NextResponse } from "next/server";
import {BedrockRuntimeClient, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";


const bedrockClient = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export async function POST(req:Request){
    try {
        const {question} = await req.json() ;

        const command = new InvokeModelCommand({
            modelId: 'arn:aws:bedrock:us-east-1:048270139939:inference-profile/us.amazon.nova-pro-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                  messages: [
            {
                role: "user",
                content: [{ text: `You are a disaster response assistant expert. ${question}` }]
            }
            ],
             inferenceConfig: {
                maxTokens: 200,
                temperature: 0.7,
                topP: 0.9
                }
            }),
        });

        const response = await bedrockClient.send(command);

        // Return
        const bodyString = new TextDecoder().decode(response.body);
        const data = JSON.parse(bodyString);
        const answer = data.output?.message?.content?.[0]?.text ?? "";
        return NextResponse.json({answer:answer}, {status: 200});
    }
    catch (error) {
        console.error("Error invoking Bedrock model:", error);
        return NextResponse.json({error: "Failed to get response from AI model."}, {status: 500});
    }
}   
