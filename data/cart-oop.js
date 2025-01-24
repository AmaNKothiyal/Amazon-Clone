function Cart(localStorageKey){
    const cart={
        cartItems:undefined,
    
        loadFromStorage(){
            this.cartItems = JSON.parse(localStorage.getItem(localStorageKey)) ||
            [{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity:2,
                deliveryOptionId:'1'
            },{
                productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
                 quantity:1,
                deliveryOptionId:'2'    
            }];
        },
    
        saveToStorage(){
            localStorage.setItem(localStorageKey,JSON.stringify(this.cartItems));
        },
    
        addToCart(productId){
            let matchingItem;
        
            const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
            const quantity = Number(quantitySelector.value);
        
            this.cartItems.forEach((cartItem)=>{
                if(productId === cartItem.productId){
                    matchingItem = cartItem;   
                }
            });
        
            if(matchingItem){
                matchingItem.quantity +=quantity;
            }else{
                this.cartItems.push({
                    productId:productId,
                    quantity:quantity,
                    deliveryOptionId:'1'
                });
            }
            this.saveToStorage();
        },
    
        removeFromCart(productId){
            const newCart=[];
            this.cartItems.forEach((cartItem)=>{
                 if(cartItem.productId!==productId)
                    newCart.push(cartItem);
            });
            
           this.cartItems=newCart;
        
            this.saveToStorage();
        },
    
        addedMessage(productId){
            let addedMessageTimeoutID;
        
            const message = document.querySelector(`.js-added-to-cart-${productId}`);
        
            message.classList.add('added-message');
        
            if(addedMessageTimeoutID)
                clearTimeout(timeoutID);
        
            const timeoutID=setTimeout(()=>{
                message.classList.remove('added-message');    
            },2000);
        
            addedMessageTimeoutID=timeoutID;
        },
    
        calculateCartQuantity(){
            let cartQuantity = 0; 
        
            this.cartItems.forEach((cartItem)=>{
                cartQuantity +=cartItem.quantity;
            });
        
            return cartQuantity;
        },
    
        updateQuantity(productId,newQuantity){
            let matchingItem;
        
            this.cartItems.forEach((cartItem)=>{
                if(productId===cartItem.productId){
                    matchingItem=cartItem;
                }
            });
        
            matchingItem.quantity=newQuantity;
            this.saveToStorage();
        },
        
        updateDeliveryOption(productId,deliveryOptionId){
            let matchingItem;
        
            this.cartItems.forEach((cartItem)=>{
                if(productId===cartItem.productId){
                    matchingItem=cartItem;
                }
            });
        
            matchingItem.deliveryOptionId=deliveryOptionId;
            this.saveToStorage();
        } 
        
    };

    return cart;
}

const cart=Cart('cart-oop');
const bussinessCart=Cart('cart-business');

cart.loadFromStorage();
bussinessCart.loadFromStorage();

console.log(cart);
console.log(bussinessCart);
