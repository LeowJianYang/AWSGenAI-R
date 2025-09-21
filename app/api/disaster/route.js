import { NextResponse } from "next/server";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export async function GET(request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("disType");

  const res = await axios.get("https://www.gdacs.org/xml/rss.xml");
  const xml = res.data;

  const jsonData = await parseStringPromise(xml, { explicitArray: false });
  let items = jsonData.rss.channel.item;

  if (!Array.isArray(items)) {
    items = [items];
  }

  const filtered = type
    ? items.filter((it) => it["gdacs:eventtype"] === type)
    : items;

  const mapped = filtered.map((it, idx) => {
    // Try geo:lat/geo:long first
    let lat = it["geo:lat"] ? parseFloat(it["geo:lat"]) : NaN;
    let lon = it["geo:long"] ? parseFloat(it["geo:long"]) : NaN;

    // Try georss:point if missing
    if ((isNaN(lat) || isNaN(lon)) && it["georss:point"]) {
      const [latStr, lonStr] = it["georss:point"].split(" ");
      lat = parseFloat(latStr);
      lon = parseFloat(lonStr);
    }

    // Try cap:point if still missing
    if ((isNaN(lat) || isNaN(lon)) && it["cap:point"]) {
      const [latStr, lonStr] = it["cap:point"].split(" ");
      lat = parseFloat(latStr);
      lon = parseFloat(lonStr);
    }

    // Try center of gdacs:bbox if still missing
    if ((isNaN(lat) || isNaN(lon)) && it["gdacs:bbox"]) {
      const bbox = it["gdacs:bbox"].split(" ").map(Number);
      if (bbox.length === 4) {
        // bbox: lonmin lonmax latmin latmax
        lon = (bbox[0] + bbox[1]) / 2;
        lat = (bbox[2] + bbox[3]) / 2;
      }
    }

    // Safely extract alertlevel
    const alertlevel =
      typeof it["gdacs:alertlevel"] === "object"
        ? it["gdacs:alertlevel"]._
        : it["gdacs:alertlevel"];

    // Extract severity
    const severity = typeof it["gdacs:severity"] === "object"
      ? {
          unit: it["gdacs:severity"].$.unit,
          value: parseFloat(it["gdacs:severity"].$.value),
        }
      : {
          unit: "N/A",
          value: 0,
        };

    // Fallback for location: use gdacs:country, else extract from title
    let location = it["gdacs:country"];
    if (!location || !location.trim()) {
  // Improved regex: capture after 'in' up to next comma
  const match = it.title && it.title.match(/in ([^,]+)/);
  location = match ? match[1].trim() : "";
  console.log('[route.js] Extracted location:', location, 'from title:', it.title);
    }

    return {
      id: it["gdacs:eventid"] || idx,
      title: it.title,
      pubDate: it.pubDate,
      eventtype: it["gdacs:eventtype"],
      alertlevel: alertlevel, 
      location,
      severity: severity,
      lat,
      lon,
    };
  });

  return NextResponse.json(mapped);
}