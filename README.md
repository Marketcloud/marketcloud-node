# node-marketcloud
Marketcloud nodejs client library

```
var Marketcloud = require('marketcloud');
var mc = new Marketcloud.Client({
   publicKey : 'your-public-key-here',
   secretKey : 'your-secret-key-here'
})

var products = mc.products.search({
  q : "A song of fire and ice",
  price : {
    $lt : 20,00 ,
    currency : "EUR"
    }
  })
  
var cart = mc.cart.getById(11)

cart.add([
   {
      id : products[0],
      quantity : 1
    }
]);

var config = {
   billing : {...},
   shipping : {...}
}
cart.checkout(config)
```
