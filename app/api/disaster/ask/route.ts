
import { NextResponse } from "next/server";
import {BedrockRuntimeClient, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";


const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION
});

export async function POST(req:Request){
    const {question} = await req.json();

    const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
            prompt: `You are a disaster response assistant expert. Answer the following question with concise and accuurate information. ${question}`,
            max_token_to_sample: 1000,
        }),
    });

    const response = await bedrockClient.send(command);

    // Return
    const bodyString = new TextDecoder().decode(response.body);
    const data = JSON.parse(bodyString);
    return NextResponse.json({answer: data.completion});
}
