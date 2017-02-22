[![Build Status](https://travis-ci.org/Marketcloud/marketcloud-node.svg?branch=master)](https://travis-ci.org/Marketcloud/marketcloud-node)
# marketcloud-node
Marketcloud API official nodejs client library

## Installation
```
npm install marketcloud-node
```

## Updating
Please remember to check the changelog for important information whenever updating to the latest version!

## Documentation
The official documentation is available at http://www.marketcloud.it/documentation/nodejs

## API overview
You can interact with the api through a Marketcloud.Client instance
```javascript
var Marketcloud = require('marketcloud-node');
var marketcloud = new Marketcloud.Client({
   public_key : 'your-public-key-here',
   secret_key : 'your-secret-key-here'
})
```
Every resource method, returns a promise:
```javascript
var product = {
			name : 'Sandman #3',
			price : 9.99,
			stock_type : 'track',
			stock_level : 10,
			author : 'Neil Gaiman',
			publisher : 'Vertigo',
			images : ['https://images.com/comic_cover.jpg']
		}

		
//Save the product
marketcloud.products.create(product)
	.then(function(response){
		var product_id = response.data.id
		expect(response.status).to.equal(true)
	})


//Retrieve a particular product
marketcloud.products.getById(123)
.then(function(response){
     console.log("The product is",response.data)
});



// Create an order
var new_order = {
   billing_address : {...},
   shipping_address : {...},
   items : [{product_id:1, variant_id : 1,quantity:1}]
}

marketcloud.orders.create(new_order)
.then(function(response){
	// Handle success
	// Log order data
	console.log(response.data);
})
.catch(function(error){
 // Handle error
 });
```
