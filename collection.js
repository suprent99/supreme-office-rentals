const categories = {
  chairs:{title:"Office Chairs",description:"Supportive, comfortable seating for focused workdays."},
  desks:{title:"Office Tables and Desks",description:"Practical desks and tables for teams of every size."},
  cabinets:{title:"Office Cabinets",description:"Smart storage that keeps your workspace organised."},
  workstations:{title:"Office Workstation Seaters",description:"Flexible workstation layouts designed for growing teams."},
  "director-desks":{title:"Director Desks",description:"Executive desks with a confident, professional presence."},
  "training-tables":{title:"Training Tables",description:"Adaptable tables for training rooms, workshops and events."},
  "conference-tables":{title:"Conference Tables and Desks",description:"Professional meeting tables for boardrooms, discussions and collaborative work."}
};

const params = new URLSearchParams(window.location.search);
const category = categories[params.get("category")] ? params.get("category") : "chairs";
const categoryInfo = categories[category];
const grid = document.querySelector("#collectionGrid");
const termSelect = document.querySelector("#collectionTermSelect");
const discounts = {1:1,3:.94,6:.88,12:.78};

document.title = `${categoryInfo.title} | Supreme Office Rentals`;
document.querySelector("#categoryTitle").textContent = categoryInfo.title;
document.querySelector("#categoryDescription").textContent = categoryInfo.description;

function money(value){return `RM${value.toLocaleString("en-MY")}`;}
function monthlyPrice(product,term){if(product.rentalRates)return product.rentalRates.find(rate=>term<=rate.max).price;return Math.round(product.price*discounts[term]);}
function renderCollection(){
  const term = Number(termSelect.value);
  const visible = products.filter(product=>product.category===category);
  grid.innerHTML = visible.map(product=>`<article class="product-card">
    <a class="product-image" href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.tag?`<span class="product-tag">${product.tag}</span>`:""}</a>
    <a class="product-info" href="product.html?id=${product.id}"><div><h3>${product.name}</h3><p>${product.type}</p></div><div class="product-price"><strong>${money(monthlyPrice(product,term))}</strong><span> / mo</span></div></a>
  </article>`).join("");
  document.querySelector("#emptyCollection").hidden = visible.length>0;
}

const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
dropdownToggle.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");dropdownToggle.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",event=>{if(!dropdown.contains(event.target)){dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}});
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
termSelect.addEventListener("change",renderCollection);
renderCollection();
