const productDetails = {
  1:{description:"A supportive everyday chair designed for long working sessions, with a breathable profile and smooth movement.",features:["Adjustable seat height","Supportive curved back","Smooth-rolling castors"],colours:["Black","Stone","Navy"]},
  2:{description:"A practical four-person workstation that gives growing teams a tidy, collaborative place to work.",features:["Integrated cable access","Durable commercial finish","Seats up to four people"],colours:["Oak","White","Walnut"],sizes:["2400 x 1200 mm","2800 x 1200 mm","3200 x 1400 mm"]},
  3:{description:"A clean-lined work desk with generous surface space for focused individual work or a compact home office.",features:["Cable management opening","Scratch-resistant surface","Sturdy steel frame"],colours:["Oak","White","Walnut"],sizes:["1200 x 600 mm","1500 x 750 mm","1800 x 750 mm"]},
  4:{description:"The Sora Task Chair brings dependable ergonomic support to the everyday office. Its contoured back, cushioned seat and adjustable height help keep teams comfortable through focused workdays.",features:["Pneumatic height adjustment","Contoured back support","360-degree swivel base","Commercial-grade upholstery"],colours:["Black","Charcoal","Navy","Sand"]},
  5:{description:"A flexible training table that is quick to arrange, fold and store for workshops, meetings and changing room layouts.",features:["Foldable top","Lockable castors","Commercial-grade frame"],colours:["White","Oak","Grey"],sizes:["1200 x 600 mm","1500 x 600 mm","1800 x 600 mm"]},
  6:{description:"Low, accessible storage for files and office essentials, designed to sit neatly beside desks or against a wall.",features:["Adjustable internal shelf","Lockable doors","Durable powder-coated finish"],colours:["White","Graphite","Sand"]},
  7:{description:"A spacious executive desk with a refined finish and practical storage for leadership offices and meeting spaces.",features:["Generous work surface","Integrated cable management","Matching side return"],colours:["Walnut","Dark Oak","Black"],sizes:["1800 x 800 mm","2000 x 900 mm","2200 x 1000 mm"]},
  8:{description:"A compact mobile pedestal that keeps everyday documents and supplies close at hand without taking over the workspace.",features:["Lockable drawers","Mobile castors","Fits beneath standard desks"],colours:["White","Graphite","Black"]}
};

const colourHex={Black:"#202323",Charcoal:"#51575a",Navy:"#213a5b",Sand:"#c9b89f",Stone:"#aaa79d",Oak:"#c99b62",White:"#f3f2ed",Walnut:"#70452f",Grey:"#92999b",Graphite:"#4c5153","Dark Oak":"#5c4030"};
const params=new URLSearchParams(window.location.search);
const product=products.find(item=>item.id===Number(params.get("id")))||products[3];
const details=productDetails[product.id];
const termSelect=document.querySelector("#rentalTerm");
const sizeSelect=document.querySelector("#sizeSelect");
let selectedColour=details.colours[0];

for(let month=1;month<=24;month+=1){const option=document.createElement("option");option.value=month;option.textContent=month===1?"1 month":month===24?"24 months (2 years)":`${month} months`;if(month===6)option.selected=true;termSelect.append(option);}

document.title=`${product.name} | Supreme Office Rentals`;
document.querySelector("#productName").textContent=product.name;
document.querySelector("#productType").textContent=product.type;
document.querySelector("#productDescription").textContent=details.description;
document.querySelector("#productImage").src=product.image;
document.querySelector("#productImage").alt=product.name;
document.querySelector("#productFeatures").innerHTML=details.features.map(feature=>`<li>${feature}</li>`).join("");
const categoryBack=document.querySelector("#categoryBack");categoryBack.href=`collection.html?category=${product.category}`;
if(product.tag){const tag=document.querySelector("#productTag");tag.textContent=product.tag;tag.hidden=false;}

const colourOptions=document.querySelector("#colourOptions");
colourOptions.innerHTML=details.colours.map((colour,index)=>`<button class="colour-swatch${index===0?" active":""}" type="button" data-colour="${colour}" aria-label="Choose ${colour}" aria-pressed="${index===0}"><span style="background:${colourHex[colour]}"></span></button>`).join("");
document.querySelector("#selectedColour").textContent=selectedColour;
colourOptions.addEventListener("click",event=>{const button=event.target.closest("[data-colour]");if(!button)return;selectedColour=button.dataset.colour;document.querySelectorAll(".colour-swatch").forEach(swatch=>{const active=swatch===button;swatch.classList.toggle("active",active);swatch.setAttribute("aria-pressed",String(active));});document.querySelector("#selectedColour").textContent=selectedColour;});

if(details.sizes){document.querySelector("#sizeOption").hidden=false;sizeSelect.innerHTML=details.sizes.map(size=>`<option>${size}</option>`).join("");}

function discountFor(months){if(months===1)return 1;if(months<=3)return .94;if(months<=6)return .88;if(months<=12)return .78;if(months<=18)return .73;return .68;}
function money(value){return `RM${value.toLocaleString("en-MY")}`;}
function paymentLabel(index){return index===0?"On delivery":`Month ${index+1}`;}
function renderSchedule(){
  const months=Number(termSelect.value);const monthly=Math.round(product.price*discountFor(months));const total=monthly*months;
  document.querySelector("#monthlyPrice").textContent=`${money(monthly)} / month`;
  document.querySelector("#rentalTotal").textContent=money(total);
  document.querySelector("#scheduleSummary").innerHTML=`<div><span>Plan length</span><strong>${months} ${months===1?"month":"months"}</strong></div><div><span>Monthly payment</span><strong>${money(monthly)}</strong></div><div><span>Total</span><strong>${money(total)}</strong></div>`;
  document.querySelector("#scheduleBody").innerHTML=Array.from({length:months},(_,index)=>`<tr><td>${index+1} of ${months}</td><td>${paymentLabel(index)}</td><td>${money(monthly)}</td></tr>`).join("");
}

termSelect.addEventListener("change",renderSchedule);
const agreementCheck=document.querySelector("#agreementCheck");const enquireButton=document.querySelector("#enquireButton");
agreementCheck.addEventListener("change",()=>{enquireButton.disabled=!agreementCheck.checked;});
enquireButton.addEventListener("click",()=>{const months=Number(termSelect.value);const monthly=Math.round(product.price*discountFor(months));const size=details.sizes?`\nSize: ${sizeSelect.value}`:"";const message=`Hi Supreme Office Rentals, I'd like to request this rental:\n\n${product.name}\nColour: ${selectedColour}${size}\nRental period: ${months} month${months===1?"":"s"}\nMonthly rental: ${money(monthly)}\nTotal: ${money(monthly*months)}\n\nI have reviewed the rental terms. Please confirm availability and delivery.`;window.open(`https://wa.me/601154209676?text=${encodeURIComponent(message)}`,"_blank","noopener");});

const dropdown=document.querySelector(".nav-dropdown");const dropdownToggle=document.querySelector(".nav-dropdown-toggle");
dropdownToggle.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");dropdownToggle.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",event=>{if(!dropdown.contains(event.target)){dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}});
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
renderSchedule();
