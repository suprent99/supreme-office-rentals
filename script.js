const discounts={1:1,3:.94,6:.88,12:.78};
let activeFilter="all";
let term=6;
let cart=[];
const grid=document.querySelector("#productGrid");
const termSelect=document.querySelector("#termSelect");
const categorySelect=document.querySelector("#categorySelect");

function monthlyPrice(product){return Math.round(product.price*discounts[term]);}
function money(value){return `RM${value.toLocaleString("en-MY")}`;}

function renderProducts(){
  const visible=products.filter(p=>activeFilter==="all"||p.category===activeFilter);
  grid.innerHTML=visible.map(p=>`<article class="product-card">
    <div class="product-image"><a class="product-image-link" href="product.html?id=${p.id}" aria-label="View ${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="add-button" type="button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
    <a class="product-info" href="product.html?id=${p.id}"><div><h3>${p.name}</h3><p>${p.type}</p></div><div class="product-price"><strong>${money(monthlyPrice(p))}</strong><span> / mo</span></div></a>
  </article>`).join("");
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

function selectCategory(category){activeFilter=category;categorySelect.value=category;renderProducts();}
categorySelect.addEventListener("change",()=>{if(categorySelect.value==="all"){selectCategory("all");return;}window.location.href=`collection.html?category=${categorySelect.value}`;});
termSelect.addEventListener("change",()=>{term=Number(termSelect.value);renderProducts();renderCart();});
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
