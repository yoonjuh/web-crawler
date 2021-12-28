import { Worker } from "worker_threads"
import path from "path"

import { log } from "./helpers"

async function main () {
  const [, , ...inputUrls] = process.argv

  if (inputUrls.length === 0) {
    throw new Error("Please provide at least one url.")
  }

  for (const url of inputUrls) {
    let formattedUrl: URL | undefined
    try {
      if (url.startsWith("www")) {
        formattedUrl = new URL(`https://${url}`)
      } else {
        formattedUrl = new URL(url)
      }
    } catch {
      throw new Error(
        `Please check if the url (${url}) is valid url. The expected format is something like 'https://www.example.com'`
      )
    }

    if (!formattedUrl) {
      continue
    }

    const worker = new Worker(path.join(__dirname, "worker.js"), { workerData: { url: formattedUrl.origin } })

    worker.on("error", (err) => {
      let errorMessage: string | undefined
      if (typeof err === "string") {
        errorMessage = err
      } else if (err?.message) {
        errorMessage = err.message
      }
      throw new Error(errorMessage)
    })

    worker.on("exit", (exitCode) => {
      if (exitCode === 0) {
        log(`Worker for ${url} is completed.`)
        return null
      }

      throw new Error(`Worker has stopped with code ${exitCode}`)
    })
  }
}

main()
