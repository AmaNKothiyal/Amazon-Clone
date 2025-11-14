import { getProduct, loadProductsFetch } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from './utils/money.js';
import { addToCart,calculateCartQuantity } from '../data/cart.js';

async function loadPage(){
  try {
    await loadProductsFetch();
    console.log('Orders:', orders);

    if (!orders || orders.length === 0) {
      document.querySelector('.js-orders-grid').innerHTML = '<div class="no-orders-message">You have no orders yet.</div>';
      return;
    }

    let ordersHTML = orders.map((order)=>{
      const orderTimeString = dayjs(order.orderTime).format('MMMM D');

      return `
      <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderTimeString}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
      <div class="order-details-grid">
        ${productsListHTML(order)}
      </div>
    </div>
      `;
    }).join("");

    document.querySelector('.js-orders-grid').innerHTML=ordersHTML;

    document.querySelectorAll('.js-buy-again').forEach((button)=>{
      button.addEventListener('click',()=>{
        addToCart(button.dataset.productId);

        button.innerHTML='Added';
        setTimeout(() => {
          button.innerHTML = `
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          `;
        }, 1000);
      });
    });
  } catch (error) {
    console.error('Error loading orders page:', error);
    document.querySelector('.js-orders-grid').innerHTML = '<div class="error-message">Error loading orders. Please refresh the page.</div>';
  }
}

function productsListHTML(order) {
  if (!order.products) {
    console.error(`Missing products for order:`, order);
    return '';
  }
  return order.products.map((productDetails) => {
    const product=getProduct(productDetails.productId);
    
    if (!product) {
      console.error(`Product not found for ID: ${productDetails.productId}`);
      return '';
    }
    
      return `
          <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
          </div>
          <div class="product-quantity">Quantity: ${productDetails.quantity}</div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
  }).join("");

}

function updateCartQuantity() {
  try {
    const cartQuantity = calculateCartQuantity();
    const cartQuantityElement = document.querySelector('.js-cart-quantity');
    if (cartQuantityElement) {
      cartQuantityElement.innerHTML = cartQuantity;
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateCartQuantity();
    loadPage();
  });
} else {
  updateCartQuantity();
  loadPage();
} 












//---------------------------------------------------------

// async function fetchOrders() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         {
//           id: "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
//           orderTime: "2024-08-12T14:30:00",
//           totalCostCents: 3506,
//           products: [
//             { productId: "p1", quantity: 1, estimatedDeliveryTime: "2024-08-15T00:00:00" },
//             { productId: "p2", quantity: 2, estimatedDeliveryTime: "2024-08-19T00:00:00" }
//           ]
//         }
//       ]);
//     }, 1000);
//   });
// }
// async function fetchProducts() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: "p1", name: "Athletic Cotton Socks - 6 Pairs", image: "images/products/socks.jpg" },
//         { id: "p2", name: "Plain Cotton T-Shirt - 2 Pack", image: "images/products/tshirt.jpg" }
//       ]);
//     }, 1000);
//   });
// }

// async function loadPage() {
//   console.log("Fetching orders and products...");

//   const [orders, products] = await Promise.all([fetchOrders(), fetchProducts()]);

//   let ordersHTML = "";

//   orders.forEach((order) => {
//     const orderDate = dayjs(order.orderTime).format("MMMM D");
//     ordersHTML += `
//       <div class="order-container">
//         <div class="order-header">
//           <div class="order-header-left-section">
//             <div class="order-date">
//               <div class="order-header-label">Order Placed:</div>
//               <div>${orderDate}</div>
//             </div>
//             <div class="order-total">
//               <div class="order-header-label">Total:</div>
//               <div>$${formatCurrency(order.totalCostCents)}</div>
//             </div>
//           </div>
//           <div class="order-header-right-section">
//             <div class="order-header-label">Order ID:</div>
//             <div>${order.id}</div>
//           </div>
//         </div>
//         <div class="order-details-grid">
//           ${renderProducts(order.products, products)}
//         </div>
//       </div>
//     `;
//   });

//   document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

//   setupEventListeners();
// }

// function renderProducts(orderProducts, allProducts) {
//   return orderProducts
//     .map((productDetails) => {
//       const product = allProducts.find((p) => p.id === productDetails.productId);
//       return `
//         <div class="product-image-container">
//           <img src="${product.image}">
//         </div>
//         <div class="product-details">
//           <div class="product-name">${product.name}</div>
//           <div class="product-delivery-date">
//             Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format("MMMM D")}
//           </div>
//           <div class="product-quantity">Quantity: ${productDetails.quantity}</div>
//           <button class="buy-again-button button-primary" data-product-id="${product.id}">
//             <img class="buy-again-icon" src="images/icons/buy-again.png">
//             <span class="buy-again-message">Buy it again</span>
//           </button>
//         </div>
//         <div class="product-actions">
//           <a href="/tracking?orderId=${productDetails.productId}&productId=${product.id}">
//             <button class="track-package-button button-secondary">Track package</button>
//           </a>
//         </div>
//       `;
//     })
//     .join("");
// }

// function setupEventListeners() {
//   document.querySelectorAll(".buy-again-button").forEach((button) => {
//     button.addEventListener("click", (event) => {
//       const productId = event.target.closest("button").dataset.productId;
//       alert(`Adding product ${productId} to cart!`);
//     });
//   });
// }

// loadPage();








//---------------------------------------------------------

// async function fetchUser(){
//   console.log("Fetching user...");
// }

// try{
//   const response=await fetch("https://randomuser.me/ap");
//   if(!response.ok)
//     throw new Error(`HTTP error! Status:${response.status}`);
//   const data = await response.json();
//   console.log("User Data:",data);
// }catch(error){
//   console.log("Error fetching user:",error.message);
// }

//---------------------------------------------------------

// async function fetchData() {
//     console.log("Fetching data...");
  
//     function simulateFetch() {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const ran = Math.random();
//           if (ran > 0.5) {
//             resolve({ status: "success", message: "📦 Data received!" });
//           } else {
//             reject({ status: "error", message: "❌ Error fetching data!" });
//           }
//         }, 2000);
//       });
//     }
  
//     try {
//       const results = await Promise.all([
//         simulateFetch(),
//         simulateFetch(),
//         simulateFetch()
//       ]);
  
//       results.forEach((data, index) => {
//         console.log(`Fetch ${index + 1}: Status: ${data.status}, Message: ${data.message}`);
//       });
  
//     } catch (error) {
//       console.log(`A request failed! Status: ${error.status}, Message: ${error.message}`);
//     }
//   }
  
//   fetchData();
//   console.log("This runs while waiting...");
  


// async function fetchData() {
//     console.log("Fetching data...");
  
//     function simulateFetch() {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const ran = Math.random();
//           if (ran > 0.5) {
//             resolve({ status: "success", message: "📦 Data received!" });
//           } else {
//             reject({ status: "error", message: "❌ Error fetching data!" });
//           }
//         }, 2000);
//       });
//     }
  
//     const results = await Promise.allSettled([
//       simulateFetch(),
//       simulateFetch(),
//       simulateFetch()
//     ]);
  
//     results.forEach((result, index) => {
//       if (result.status === "fulfilled") {
//         console.log(`Fetch ${index + 1}: Status: ${result.value.status}, Message: ${result.value.message}`);
//       } else {
//         console.log(`Fetch ${index + 1}: Failed - ${result.reason.message}`);
//       }
//     });
//   }
  
//   fetchData();
//   console.log("This runs while waiting...");


// async function fetchData() {
//     console.log("Fetching data...");
//     try{
//         const data = await new Promise((resolve,reject) => {
//             const ran=Math.random();
//             if(ran>0.5)
//                 resolve({status:"success",msg:"📦 Data received!"});
//             else
//                 reject({status:"error",msg:"❌ Error fetching data!"});
//         });
        
//           console.log("success:",data);
//     }catch(error){
//         console.log("error:",error);
//     }
//   }
  
//   fetchData();
//   console.log("This runs while waiting...");
  

  // async function testFetch() {
  //     console.log("Fetching...");
  //     const result = await new Promise((resolve) => {
  //       setTimeout(() => resolve("Data loaded!"), 2000);
  //     });
  //     console.log(result);
  //   }
    
  //   testFetch();



//   const myPromise = new Promise((resolve, reject) => {
//     let success = true; // Change to false to test rejection
  
//     setTimeout(() => {
//       if (success) {
//         resolve("✅ Order delivered!");
//       } else {
//         reject("❌ Order failed!");
//       }
//     }, 2000);
//   });

//   console.log(myPromise);

  
// const myPromise = new Promise((resolve, reject) => {
//     let success = true; // Change to false to test rejection
  
//     setTimeout(() => {
//       if (success) {
//         resolve("✅ Order delivered!");
//       } else {
//         reject("❌ Order failed!");
//       }
//     }, 2000);
//   });
  
//   myPromise.then((msg)=>{
//     console.log('Success:',msg)
//   }).catch((error)=>{
//     console.log('Error:',error);
//   });
  

//   const testPromise = new Promise((resolve, reject) => {
//     console.log("Promise started");
//     // reject("Error occurred!");
//     resolve("Success!"); 
//   });
  


//---------------------------------------------------------

// console.log(formatCurrency(3506))

//---------------------------------------------------------

// console.log(dayjs().format('MMMM D, YYYY'));  // Today’s date

//---------------------------------------------------------

// const products=[
// {id:"101",name:"Socks"},
// {id:"102",name:"T-Shirt"}
// ];

// // function getProduct(productId){
// //     return products.find((product)=>{
// //         return product.id===productId
// //     });
// // }
// function getProduct(productId){
//     return products.find(product => product.id === productId);
// }
// console.log(getProduct("101"));