document.querySelector(".menu-button").addEventListener("click",event=>{
  const nav=document.querySelector(".main-nav");
  nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));
});

function lowestMonthlyPrice(product){
  if(product.rentalRates)return product.rentalRates[product.rentalRates.length-1].price;
  return Math.round(product.price*.68);
}

document.querySelectorAll(".category-card[data-category]").forEach(card=>{
  const categoryProducts=products.filter(product=>product.category===card.dataset.category);
  const priceLabel=card.querySelector("[data-category-price]");
  if(!categoryProducts.length){priceLabel.textContent="Coming soon";return;}
  const lowest=Math.min(...categoryProducts.map(lowestMonthlyPrice));
  priceLabel.textContent=`From RM${lowest.toLocaleString("en-MY")} / month`;
});
