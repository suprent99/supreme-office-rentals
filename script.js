const discounts={1:1,3:.94,6:.88,12:.78};
let term=6;
let cart=[];
const grid=document.querySelector("#productGrid");

function monthlyPrice(product){if(product.rentalRates)return product.rentalRates.find(rate=>term<=rate.max).price;return Math.round(product.price*discounts[term]);}
function money(value){return `RM${value.toLocaleString("en-MY")}`;}
function lowestMonthlyPrice(product){if(product.rentalRates)return product.rentalRates[product.rentalRates.length-1].price;return Math.round(product.price*.68);}

const productCategories=[
  {id:"chairs",name:"Office chairs",description:"Comfortable seating for focused workdays",image:"assets/vivo-task-chair.png"},
  {id:"desks",name:"Office tables / desks",description:"Practical work surfaces for individuals and teams",image:"assets/useful-work-desk-maple.webp"},
  {id:"cabinets",name:"Office cabinets",description:"Smart storage for organised workplaces",image:"https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=80"},
  {id:"workstations",name:"Office workstation seaters",description:"Flexible workstation setups for growing teams",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80"},
  {id:"director-desks",name:"Director desks",description:"Executive desks with a professional presence",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80"},
  {id:"training-tables",name:"Training tables",description:"Adaptable tables for workshops and events",image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80"},
  {id:"conference-tables",name:"Conference tables / desks",description:"Professional tables for meetings and collaboration",image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80"}
];

function renderProducts(){
  grid.innerHTML=productCategories.map(category=>{const categoryProducts=products.filter(product=>product.category===category.id);const lowest=categoryProducts.length?Math.min(...categoryProducts.map(lowestMonthlyPrice)):null;return `<article class="product-card">
    <a class="product-image" href="collection.html?category=${category.id}" aria-label="View ${category.name}"><img src="${category.image}" alt="${category.name}" loading="lazy"></a>
    <a class="product-info" href="collection.html?category=${category.id}"><div><h3>${category.name}</h3><p>${category.description}</p><span class="home-category-price">${lowest===null?"Coming soon":`From ${money(lowest)} per month`}</span></div></a>
  </article>`;}).join("");
}

function renderCart(){
  const items=document.querySelector(".cart-items");
  const empty=document.querySelector(".cart-empty");
  items.innerHTML=cart.map(id=>{const p=products.find(x=>x.id===id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(monthlyPrice(p))} / month · ${term} month plan</p></div><button class="remove-item" type="button" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`}).join("");
  empty.hidden=cart.length>0;
  document.querySelector(".cart-footer").hidden=cart.length===0;
  document.querySelector(".cart-count").textContent=cart.length;
  document.querySelector(".cart-total").textContent=money(cart.reduce((sum,id)=>sum+monthlyPrice(products.find(p=>p.id===id)),0));
}

function toggleCart(open){
  document.querySelector(".cart-drawer").classList.toggle("open",open);
  document.querySelector(".cart-overlay").classList.toggle("open",open);
  document.querySelector(".cart-drawer").setAttribute("aria-hidden",String(!open));
  document.body.classList.toggle("no-scroll",open);
}

grid.addEventListener("click",event=>{
  const button=event.target.closest("[data-add]");if(!button)return;
  const id=Number(button.dataset.add);if(!cart.includes(id))cart.push(id);
  renderCart();const toast=document.querySelector(".toast");toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);
});
document.querySelector(".cart-items").addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(!button)return;cart=cart.filter(id=>id!==Number(button.dataset.remove));renderCart();});
document.querySelector(".cart-button").addEventListener("click",()=>toggleCart(true));
document.querySelector(".close-cart").addEventListener("click",()=>toggleCart(false));
document.querySelector(".cart-overlay").addEventListener("click",()=>toggleCart(false));
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
const dropdown=document.querySelector(".nav-dropdown");
const dropdownToggle=document.querySelector(".nav-dropdown-toggle");
dropdownToggle.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");dropdownToggle.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",event=>{if(!dropdown.contains(event.target)){dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}});
document.querySelectorAll(".main-nav a").forEach(link=>link.addEventListener("click",()=>{document.querySelector(".main-nav").classList.remove("open");dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}));
document.querySelector(".checkout-button").addEventListener("click",()=>{
  const list=cart.map(id=>{const p=products.find(x=>x.id===id);return `- ${p.name} (${money(monthlyPrice(p))}/month)`}).join("\n");
  const total=cart.reduce((sum,id)=>sum+monthlyPrice(products.find(p=>p.id===id)),0);
  const message=`Hi Supreme Office Rentals, I'd like to check availability for a ${term}-month rental:\n\n${list}\n\nMonthly total: ${money(total)}`;
  window.open(`https://wa.me/601154209676?text=${encodeURIComponent(message)}`,"_blank","noopener");
});

renderProducts();renderCart();

const rentComparison=document.querySelector("[data-rent-comparison]");
if(rentComparison){
  if("IntersectionObserver" in window){
    const comparisonObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){rentComparison.classList.add("is-visible");comparisonObserver.disconnect();}},{threshold:.18});
    comparisonObserver.observe(rentComparison);
  }else{rentComparison.classList.add("is-visible");}
}

document.querySelectorAll(".journey-toggle").forEach(toggle=>{
  toggle.addEventListener("click",()=>{
    const card=toggle.closest(".journey-card");
    const willOpen=!card.classList.contains("open");
    document.querySelectorAll(".journey-card.open").forEach(openCard=>{openCard.classList.remove("open");openCard.querySelector(".journey-toggle").setAttribute("aria-expanded","false");});
    card.classList.toggle("open",willOpen);
    toggle.setAttribute("aria-expanded",String(willOpen));
  });
});
