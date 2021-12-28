import { workerData } from "worker_threads"

import { crawl } from "./helpers"

async function initiateWorker () {
  const { url } = workerData
  return crawl({
    currentUrl: url,
    depth: 1,
    domain: url,
    visitedUrls: new Set<string>()
  })
}

initiateWorker()
