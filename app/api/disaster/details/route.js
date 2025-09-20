// POST

import { NextResponse } from "next/server";
import axios from "axios";
import { parseStringPromise } from "xml2js";


// POST /api/disaster/details

export async function GET(request){
    
    const searchParams = new URL (request.url);
    const EID = searchParams.searchParams.get('eventId');
    const ETY = searchParams.searchParams.get('eventType');

    const res = await axios.get(`https://www.gdacs.org/contentdata/resources/${ETY}/${EID}/cap_${EID}.xml`);

    const xml = await res.data;
    const jsonData = await parseStringPromise(xml, {explicitArray: false});

    return NextResponse.json(jsonData);
}