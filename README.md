# marketcloud-node
Marketcloud API official nodejs client library

## Installation
```
npm install marketcloud-node
```

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
			images : ['https://nothingbutcomics.files.wordpress.com/2013/10/sndm-cv1-cbldf-bw-var-4c717.jpg']
		}
//Save the product
marketcloud.products.create(product)
	.then(function(response){
		var product_id = response.body.data.id
		expect(response.status).to.equal(200)
	})
//Retrieve a particular product
marketcloud.products.getById(PRODUCT_ID)
.then(function(product){
     
});



// Create an order
var new_order = {
   billing_address : {...},
   shipping_address : {...},
   items : [{product_id:1, variant_id : 1,quantity:1}]
}

marketcloud.orders.create(new_order)
.then(function(order){
	// Handle success
})
.catch(function(error){
 // Handle error
 });
```
