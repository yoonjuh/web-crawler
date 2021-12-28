import * as cheerio from "cheerio"
import axios from "axios"
import chalk from "chalk"

export const CRAWLER_DEPTH_LIMIT = 5

export interface LinkMap {
  error?: boolean
  links: Array<string | LinkMap>
  url: string
}

export interface CrawlerOptions {
  currentUrl: string
  depth: number
  domain: string
  visitedUrls: Set<string>
}
export async function crawl ({
  currentUrl,
  depth,
  domain,
  visitedUrls
}: CrawlerOptions): Promise<LinkMap> {
  /**
   * This is the function that has the main logic of the app.
   * It will go deeper as it finds more links associated with the given domain name.
  */

  const links = await getLinks(currentUrl)
  if (links === null) {
    return {
      url: currentUrl,
      links: [],
      error: true
    }
  }

  // Log in the terminal
  log(currentUrl, links)

  // Register current url to the visited list
  visitedUrls.add(currentUrl)

  const result: LinkMap = {
    links,
    url: currentUrl
  }

  // To avoid duplicate or unnecessary visits, filter the links with domain name and visitedLinks 
  const visitCandidates = links.filter((link) => isSameDomain(domain, link) && !isVisitedUrl(visitedUrls, link))

  // For demonstration purpose, the limit is currently set to 5
  if (depth < CRAWLER_DEPTH_LIMIT) {
    for await (const candidate of visitCandidates) {
      const crawlResult = await crawl({
        domain,
        currentUrl: candidate,
        visitedUrls: visitedUrls,
        depth: depth + 1
      })
      result.links.push(crawlResult)
    }
  }

  return result
}

export async function getLinks (url: string): Promise<string[] | null> {
  // Fetch html
  const response = await axios
    .get(url)
    .catch((error) => {
      console.error(error)
    })

  if (!response) {
    return null
  }

  // Parse the response data
  const $ = cheerio.load(response.data)

  // Filter html for only
  return $("a")
    .map((i, link) => link.attribs.href)
    .get()
    .filter((link) => link.startsWith("http"))
}

export function isSameDomain (originUrl: string, parsedUrl: string) {
  let { hostname } = new URL(originUrl)
  if (hostname.startsWith("www")) {
    // prettify url in case the link has different prefix
    hostname = hostname.substring(4)
  }
  // Split is to prevent querystring match
  return parsedUrl.split("?")[0].includes(hostname)
}

export function isVisitedUrl (visitedUrls: Set<string>, currentUrl: string) {
  const hasCurrentUrl = visitedUrls.has(currentUrl)
  if (currentUrl[currentUrl.length - 1] === "/") {
    return hasCurrentUrl || visitedUrls.has(currentUrl.slice(0, -1))
  }
  return hasCurrentUrl || visitedUrls.has(currentUrl + "/")
}

export function log (visitedUrl: string, links: string[] = []) {
  console.log(`${chalk.blueBright(visitedUrl)}\n `, links.join("\n  "))
}
