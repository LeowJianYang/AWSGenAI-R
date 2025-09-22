import { NextResponse } from 'next/server'
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses';
import bcrypt from 'bcryptjs';

const dynamo= new DynamoDBClient({
    region: 'us-east-1',
    credentials:{
        accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

  const ses = new SESClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

function generateVerificationCode(){
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {

  const {username, email, password, nickname} = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  await dynamo.send(new PutItemCommand({
     TableName: 'User',
     Item:{
       User_Email: {S: email},
        username: {S: username},
        password: {S: hashedPassword},
        nickname: {S: nickname}
     }
  }));

  const accessKey = generateVerificationCode();
  await dynamo.send(new PutItemCommand({
    TableName: "AccessKey",
    Item:{
      User_Email: {S: email},
      accessKey: {S: accessKey},
      AccessKeyTerm :{N: Math.floor(Date.now() / 1000 + 86400).toString()}
    }
  }))


   await ses.send( new SendEmailCommand({
    Destination:{
      ToAddresses:[email]
    },
    Message:{
      Subject:{Data: "Welcome to Agies Distaster ! This is a confirmation email."},
      Body:{
        Text:{Data: `
          Dear ${nickname},
          \n
          Thank you for signing up for Agies Distaster. We're glad to have you on board!\n 
          This Is Your Verification Code: ${accessKey} \n
          `}
      }
    },
    Source: process.env.SES_SENDER_EMAIL
   }))


//     if (req.method === 'POST') {
//       const { id, message } = req.body
//       await connection.execute(
//         'INSERT INTO disaster_alerts (id, message, created_at) VALUES (?, ?, NOW())',
//         [id, message]
//       )
//       res.status(200).json({ success: true })
//     } else if (req.method === 'GET') {
//       const { id } = req.query
//       const [rows] = await connection.execute('SELECT * FROM disaster_alerts WHERE id = ?', [id])
//       res.status(200).json(rows)
//     } else {
//       res.status(405).json({ error: 'Method not allowed' })
//     }

//     await connection.end()
//   } catch (err:any) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
    return NextResponse.json({message: "UserConnected !"}, {status: 200} );
}
