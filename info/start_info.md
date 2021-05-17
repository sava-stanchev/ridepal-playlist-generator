
### API key

AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr


### Request format

request type - GET
http://dev.virtualearth.net/REST/V1/Routes/(tipe of traveling)?wp.0=(town name or coordinates)&wp.1=(town name or coordinates)&routeAttributes=excludeItinerary&key=(API key from BING)

Example

http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0= 42.727143,23.32592&wp.1=42.26317,23.095259&routeAttributes=excludeItinerary&key=AlyPtpHnx-TC4cf6hqJyd2oQKsQwnovawxxxnua_ml-uIxALhwZ__iJg9izB3iHr

Sofiq to Dupnica


### Response
```js
        const distance = response.resourceSets[0].resources[0].travelDistance;
        const duration = response.resourceSets[0].resources[0].travelDuration;
```


installed
dotenv
node-fetch