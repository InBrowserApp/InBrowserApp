import { buildSitemapXml, getSitemapEntries } from "@/lib/seo"
export async function GET() {
  return new Response(buildSitemapXml(getSitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
