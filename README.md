## Overview 
The web crawler is to get all the links from anchor tag from the given website urls and continue to crawl the website links thar are found on that page. 
It has duplicate link detection so that it won't revisit the same url. Also, it consider as a valid visit candidate only if the found link as the same domain as given url.

For the demonstration purpose, I set `CRAWLER_DEPTH_LIMIT` as 5. So it won't go further than 5 nested links.

<hr/>

## How do run this app?
### Run it with Docker
If your machine has setup for docker, you can run this app without installing extra packages in you machine

To run the testing 
```sh
# For testing, from the project root directory
docker build -f Dockerfile.test --tag your-tag .

# execute the testing with urls 
docker run your-tag
```

To run the app
```sh
# For the app build, from the project root directory
docker build -f Dockerfile --tag your-tag .

# execute the testing with any number of urls  
docker run your-tag https://www.some-website.come https://this-is-example-website-url.com # ...
```

<hr/>

### Run it from you local machine 
Install node
> If your machine has node installed already, please skip this part. Otherwise, install it from nodejs official website (https://nodejs.org/en/download/) 

`Installing dependencies` by running `npm i` from the project root directory

`Build typescript project` by running `npm run build` from the project root directory

`Run tests` by running `npm run test` from the project root directory

`Run tests` by running `npm run test` from the project root directory

`Run the app` by running `npm run start` followed by the website links 
```sh
# i.e. 
npm run start https://www.some-website.com https://www.it-can-run-with-multiple-ruls.com
```