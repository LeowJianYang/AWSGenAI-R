
import { NextResponse } from "next/server";
import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcryptjs';

const dynamo = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

export async function POST(request){
    const {email, password} = await request.json();

     const dynamodb =await dynamo.send(new GetItemCommand({
        TableName:'User',
        Key:{
            User_Email: {S: email}
        }
    }))

    if(!dynamodb.Item){
        return NextResponse.json({message: "User Not Found"}, {status: 404});
    };

    const storeHashedPass = dynamodb.Item.password.S;
    const isPasswordValid = await bcrypt.compare(password, storeHashedPass);
    if(!isPasswordValid){
        return NextResponse.json({message: "Invalid Password"}, {status: 401});
    }
    const nickname = dynamodb.Item.nickname.S;
    return NextResponse.json({message: "Login Successful", user:{email, nickname}}, {status: 200});
};