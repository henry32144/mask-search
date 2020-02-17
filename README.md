# Mask Search

[Demo Website](https://mask-search.herokuapp.com/) 

This is a mask searching website that provides user with the visualized data of how many mask remain in each county of Taiwan. User can also type the store name or location to search for the stores and check the mask stocks. I hope this may help any people in Taiwan to buy mask and keep the virus away.

The website is implemented with React and Leaflet. There is also [the backend part of this project](https://github.com/henry32144/mask-search-server).

**Note:** Since I'm going to serve my military oblibation at 2/19, I don't have enough time to implement more functions such as adding markers on the map, sorry.

## Packages

* react: "^16.12.0"
* react-bootstrap: "^16.12.0"
* react-icons: "^3.9.0"
* framer-motion: "^1.8.4"
* leaflet: "^1.6.0"
* leaflet.awesome-markers: "^2.0.5"
* rc-pagination: "^1.21.0"

Please check package.json for more details.

## How to Run

1. Clone this repo.

2. Cd to the folder of this project and type `npm install`.

3. Run `npm start`.

**In order to fetch the data from the government's webiste, you should also run the [server](https://github.com/henry32144/mask-search-server)**

## Author

CHENG-HAN Wu