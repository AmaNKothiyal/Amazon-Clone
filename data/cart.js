export let cart = JSON.parse(localStorage.getItem('cart')) ||

[{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity:2
  },{
    productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity:1
    
  }];

  function saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
  }

export function addToCart(productId){
    let matchingItem;

    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const quantity = Number(quantitySelector.value);
    console.log(quantity);

    cart.forEach((cartItem)=>{
        if(productId === cartItem.productId){
            matchingItem = cartItem;   
        }
    });

    if(matchingItem){
        matchingItem.quantity +=quantity;
    }else{
        cart.push({
            productId:productId,
            quantity:quantity
        });
    }
    saveToStorage();
}

export function removeFromCart(productId){
    const newCart=[];
    cart.forEach((cartItem)=>{
         if(cartItem.productId!==productId)
            newCart.push(cartItem);
    });
    
    cart=newCart;

    saveToStorage();
}

export function addedMessage(productId){
    let addedMessageTimeoutID;
    
    const message = document.querySelector(`.js-added-to-cart-${productId}`);

    message.classList.add('added-message');

    if(addedMessageTimeoutID)
            clearTimeout(timeoutID);

    const timeoutID=setTimeout(()=>{
        message.classList.remove('added-message');    
    },2000);

    addedMessageTimeoutID=timeoutID;
}