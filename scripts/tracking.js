import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage(){
    await loadProductsFetch();
    
    const url = new URL(window.location.href);
    const orderId=url.searchParams.get('orderId');
    const productId=url.searchParams.get('productId');

    const order = getOrder(orderId);
    const product = getProduct(productId);

    // for product details.
    let productDetails = order.products.find((p)=>p.productId===product.id);

    const today=dayjs();
    const orderTime=dayjs(order.orderTime);
    const deliveryTime=dayjs(productDetails.estimatedDeliveryTime);

    const percentProgress=((today-orderTime)/(deliveryTime-orderTime))*100;

    const deliveryMessage = today<deliveryTime?'Arriving on':'Delivered on';

    const trackingHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
        </a>

        <div class="delivery-date">
            ${deliveryMessage} ${
                dayjs(productDetails.estimatedDeliveryTime).format('dddd,MMMM D')
            }
        </div>

        <div class="product-info">
           ${product.name}
        </div>

        <div class="product-info">
            Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
            <div class="progress-label" ${percentProgress<50 ? 'current-status' : ''}>
            Preparing
            </div>
            <div class="progress-label ${(percentProgress>=50 && percentProgress<100)? 'current-status':''}">
            Shipped
            </div>
            <div class="progress-label ${percentProgress>=100 ? 'current-status':''}">
            Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar" style="width:${percentProgress}%;"></div>
        </div>
    `;

    document.querySelector('.js-order-tracking').innerHTML=trackingHTML;

}   
loadPage();