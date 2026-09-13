import { NextRequest, NextResponse } from "next/server";
const googleTrends = require("google-trends-api");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("query");

  if (!keyword) {
    return NextResponse.json(
      { error: "query parametresi gerekli, örnek: /api/trends?query=ice+maker" },
      { status: 400 }
    );
  }

  try {
    const results = await googleTrends.interestOverTime({
      keyword: keyword,
      geo: "GB",
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    const data = JSON.parse(results);
    const timelineData = data.default.timelineData;

    if (!timelineData || timelineData.length === 0) {
      return NextResponse.json({ keyword, growth: 0, dataPoints: [] });
    }

    const firstValue = timelineData[0].value[0];
    const lastValue = timelineData[timelineData.length - 1].value[0];
    const growth =
      firstValue === 0 ? 0 : Math.round(((lastValue - firstValue) / firstValue) * 100);

    return NextResponse.json({
      keyword,
      firstValue,
      lastValue,
      growth,
      dataPoints: timelineData.map((d: any) => ({
        time: d.formattedTime,
        value: d.value[0],
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Google Trends verisi alınamadı", details: String(error) },
      { status: 500 }
    );
  }
}