import { NextResponse } from "next/server";
import axios from "axios";
import { parseStringPromise } from "xml2js";

// GET /api/disaster (?disType= EQ, TC, FL, VO, SE)

/**
 * **GET METHOD**
 * 
 * For getting disaster infomation from GDACS Data
 * If not given any disType, return all types
 * @searchParams distype = EQ (earthquake) | TC (Typhoon) | FL | VO (Volcano) | SE | undefined
 * @param {*} request
 * @example 
 * - For using Params
 * /api/disaster?disType=EQ
 * - For all types
 * /api/disaster
 * @returns
 */
export async function GET(request){

    const searchParams = new URL(request.url);
    const type = searchParams.searchParams.get('disType');

    const res = await axios.get("https://www.gdacs.org/xml/rss.xml");
    const xml = await res.data;

    const jsonData = await parseStringPromise(xml, {explicitArray: false});

    let items= jsonData.rss.channel.item;

    if (!Array.isArray(items)) {
        items= [items];
    };

    const filtered = type ? items.filter((it)=> it['gdacs:eventtype'] === type) : items;

    const mapped = filtered.map((it)=> ({

        title: it.title,
        pubDate: it.pubDate,
        eventtype: it['gdacs:eventtype'],
        alertlevel: it['gdacs:alertlevel'],
        country: it['gdacs:country'],
        severity: it['gdacs:severity'] || "N/A",
        cap: it['gdacs:cap'],
        eventid: it['gdacs:eventid'] 
    }));

    return NextResponse.json(mapped);
};


