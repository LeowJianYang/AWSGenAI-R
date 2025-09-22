
import { NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb"

const dynamo = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function POST(request){
    const {email, code} = await request.json();

    const dynamodb = await dynamo.send(new GetItemCommand({
        TableName: "AccessKey",
        Key:{
            User_Email: {S: email}
        }
    }));

    if(!dynamodb.Item){
        return NextResponse.json({message: "User Not Found"}, {status: 404});
    };
    const storedCode = dynamodb.Item.accessKey.S;
    
    if(storedCode !== code){
        return NextResponse.json({message: "Invalid Code"}, {status: 400});
    };

    return NextResponse.json({message: "Email Confirmed"}, {status: 200});
}