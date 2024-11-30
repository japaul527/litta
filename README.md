# Overview

To run the server,goto the root folder and type:

    npx ts-node-dev src/index.ts

To run test, 

    npx jest

To run cURL, first run the server and then:

    bash curl_endpoints.sh

Done in Typescript and Express. 
Validation using Zod.
Authentication using JWT with user roles.
In-memory database used.
Tests done in Jest available in __Tests__ folder under src .

cURl and jest covers all API test_cases.
All cURL requests are present in curl_endpoints.sh 

# installation


    npm install
    sudo apt-get install jq  
