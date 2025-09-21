import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";


export async function POST(request) {

const secret_name = "rds!cluster-a9ae4833-a7c7-4260-bd77-734377f73c8d";

const client = new SecretsManagerClient({
  region: "us-east-1",
  credentials:{
    accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", 
    })
  );
} catch (error) {
  throw error;
}

// try {
  const secret = JSON.parse(response.SecretString || "{}");
  //  IAM auth token

    const { username, password, host, dbname } = secret;


    const connection = await mysql.createPool({
      host,
      user: username,
      password,
      database: dbname,
      port: 3306,
      ssl: { rejectUnauthorized: false },
    })
    console.log( username, host, dbname, "PASSWORD :", password);

        try {
    await connection.ping()  
    console.log('✅ Connected successfully!');
    } catch (err) {
    console.error('❌ Connection failed:', err)
    } finally {
    await connection.end()
    }


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
    return NextResponse.json({message: "DB connected"}, {status: 200} );
}
