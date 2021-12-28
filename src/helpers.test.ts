import axios from "axios"
import { getLinks, isSameDomain, isVisitedUrl } from "./helpers"

describe("getLinks", () => {
  let mockAxiosGet: jest.SpyInstance
  const MOCK_TEST_URL = "https://www.example.com"

  beforeAll(() => {
    mockAxiosGet = jest.spyOn(axios, "get")
  })

  it("should return null if there is an error on fetching data.", async () => {
    mockAxiosGet.mockImplementationOnce(() => {
      return Promise.reject(new Error("This is an expected error message."))
    })

    const result = await getLinks(MOCK_TEST_URL)
    expect(mockAxiosGet).toHaveBeenCalledWith(MOCK_TEST_URL)
    expect(result).toBeNull()
  })

  it("should return only the urls starts with http or https.", async () => {
    const expectedResult = [
      "https://www.example.com",
      "http://www.example.com"
    ]

    mockAxiosGet.mockImplementationOnce(() => {
      return Promise.resolve({
        data: [
          "<div>",
          `<a href=${expectedResult[0]}>link A</a>`,
          "<a href='hello.com'>link B</a>",
          `<a href=${expectedResult[1]}>link C</a>`,
          "<a href='somelink.com' ><link D</a>",
          "</div>"
        ].join("")
      })
    })
    const result = await getLinks(MOCK_TEST_URL)
    expect(mockAxiosGet).toHaveBeenCalledWith(MOCK_TEST_URL)
    expect(result).toEqual(expectedResult)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})

describe("isSameDomain", () => {
  const TEST_DOMAIN_URL = "https://www.example.com/"

  it("should return true if they're using the same url domain", () => {
    expect(isSameDomain(TEST_DOMAIN_URL, "http://www.example.com")).toEqual(true)
    expect(isSameDomain(TEST_DOMAIN_URL, "http://example.com/")).toEqual(true)
    expect(isSameDomain(TEST_DOMAIN_URL, "example.com/")).toEqual(true)
    expect(isSameDomain(TEST_DOMAIN_URL, "http://www.api.example.com")).toEqual(true)
    expect(isSameDomain(TEST_DOMAIN_URL, "http://www.example.com?query=string")).toEqual(true)
  })

  it("should return false if the domain is found on querystring", () => {
    expect(isSameDomain(TEST_DOMAIN_URL, "http://www.another.com?webhook_url=https://www.example.com")).toEqual(false)
  })
})

describe("isVisitedUrl", () => {
  const VISITED_URLS = new Set([
    "https://www.example.com",
    "https://www.example.com/about",
    "https://www.example.com/career",
    "https://www.example.com?webhook_url=www.another.com"
  ])

  it("should return return true if current url is already visited", () => {
    expect(isVisitedUrl(VISITED_URLS, "https://www.example.com")).toEqual(true)
    expect(isVisitedUrl(VISITED_URLS, "https://www.example.com/")).toEqual(true)
    expect(isVisitedUrl(VISITED_URLS, "https://www.another.com")).toEqual(false)
  })
})
