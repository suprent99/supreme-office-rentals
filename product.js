const usefulDeskDetails={description:"A durable everyday work desk made from melamine-faced chipboard and finished with dark grey panel wood legs.",features:["Melamine-faced chipboard (MFC)","Dark grey panel wood legs","Integrated cable access"],sizes:["1200W x 700D x 750H mm","1500W x 700D x 750H mm","1800W x 700D x 750H mm"],sellingPrices:{"1200W x 700D x 750H mm":215,"1500W x 700D x 750H mm":255,"1800W x 700D x 750H mm":295},rentalRatesBySize:{"1200W x 700D x 750H mm":[{max:1,price:85},{max:3,price:55},{max:6,price:38},{max:12,price:27},{max:18,price:22},{max:24,price:18}],"1500W x 700D x 750H mm":[{max:1,price:100},{max:3,price:65},{max:6,price:45},{max:12,price:32},{max:18,price:26},{max:24,price:21}],"1800W x 700D x 750H mm":[{max:1,price:115},{max:3,price:75},{max:6,price:52},{max:12,price:37},{max:18,price:30},{max:24,price:24}]}};
const productDetails = {
  2:{description:"A practical four-person workstation that gives growing teams a tidy, collaborative place to work.",features:["Integrated cable access","Durable commercial finish","Seats up to four people"],colours:["Oak","White","Walnut"],sizes:["2400 x 1200 mm","2800 x 1200 mm","3200 x 1400 mm"]},
  5:{description:"A flexible training table that is quick to arrange, fold and store for workshops, meetings and changing room layouts.",features:["Foldable top","Lockable castors","Commercial-grade frame"],colours:["White","Oak","Grey"],sizes:["1200 x 600 mm","1500 x 600 mm","1800 x 600 mm"]},
  6:{description:"Low, accessible storage for files and office essentials, designed to sit neatly beside desks or against a wall.",features:["Adjustable internal shelf","Lockable doors","Durable powder-coated finish"],colours:["White","Graphite","Sand"]},
  7:{description:"A spacious executive desk with a refined finish and practical storage for leadership offices and meeting spaces.",features:["Generous work surface","Integrated cable management","Matching side return"],colours:["Walnut","Dark Oak","Black"],sizes:["1800 x 800 mm","2000 x 900 mm","2200 x 1000 mm"]},
  8:{description:"A compact mobile pedestal that keeps everyday documents and supplies close at hand without taking over the workspace.",features:["Lockable drawers","Mobile castors","Fits beneath standard desks"],colours:["White","Graphite","Black"]},
  9:{description:"A practical low-back task chair with a breathable fabric mesh back and supportive fabric cushion seat for everyday office use.",features:["Breathable fabric mesh back","Fabric cushion seat","High-quality polypropylene base and legs","Adjustable seat height"],colours:["Black"],sizes:["620W x 660D x 900-1000H mm"]},
  10:{...usefulDeskDetails,colours:["Cherry-Dark Grey"]},
  11:{...usefulDeskDetails,colours:["Maple-Dark Grey"]},
  12:{...usefulDeskDetails,colours:["Light Grey-Dark Grey"]}
};

const colourHex={Black:"#202323",Charcoal:"#51575a",Navy:"#213a5b",Sand:"#c9b89f",Stone:"#aaa79d",Oak:"#c99b62",White:"#f3f2ed",Walnut:"#70452f",Grey:"#92999b",Graphite:"#4c5153","Dark Oak":"#5c4030","Cherry-Dark Grey":"#a76437","Maple-Dark Grey":"#d8bd7e","Light Grey-Dark Grey":"#c5c8cd"};
const params=new URLSearchParams(window.location.search);
const product=products.find(item=>item.id===Number(params.get("id")))||products[0];
const details=productDetails[product.id];
const termSelect=document.querySelector("#rentalTerm");
const sizeSelect=document.querySelector("#sizeSelect");
let selectedColour=details.colours[0];

for(let month=1;month<=24;month+=1){const option=document.createElement("option");option.value=month;option.textContent=month===1?"1 month":month===24?"24 months (2 years)":`${month} months`;if(month===6)option.selected=true;termSelect.append(option);}

document.title=`${product.name} | Supreme Office Rentals`;
document.querySelector("#productName").textContent=product.name;
document.querySelector("#productType").textContent=product.type;
document.querySelector("#productDescription").textContent=details.description;
document.querySelector("#productImage").src=details.imagesByColour?details.imagesByColour[selectedColour]:product.image;
document.querySelector("#productImage").alt=product.name;
document.querySelector("#productFeatures").innerHTML=details.features.map(feature=>`<li>${feature}</li>`).join("");
const categoryBack=document.querySelector("#categoryBack");categoryBack.href=`collection.html?category=${product.category}`;
if(product.tag){const tag=document.querySelector("#productTag");tag.textContent=product.tag;tag.hidden=false;}

const colourOptions=document.querySelector("#colourOptions");
colourOptions.innerHTML=details.colours.map((colour,index)=>`<button class="colour-swatch${index===0?" active":""}" type="button" data-colour="${colour}" aria-label="Choose ${colour}" aria-pressed="${index===0}"><span style="background:${colourHex[colour]}"></span></button>`).join("");
document.querySelector("#selectedColour").textContent=selectedColour;
colourOptions.addEventListener("click",event=>{const button=event.target.closest("[data-colour]");if(!button)return;selectedColour=button.dataset.colour;document.querySelectorAll(".colour-swatch").forEach(swatch=>{const active=swatch===button;swatch.classList.toggle("active",active);swatch.setAttribute("aria-pressed",String(active));});document.querySelector("#selectedColour").textContent=selectedColour;if(details.imagesByColour){document.querySelector("#productImage").src=details.imagesByColour[selectedColour];document.querySelector("#productImage").alt=`${product.name} in ${selectedColour}`;}});

if(details.sizes){document.querySelector("#sizeOption").hidden=false;sizeSelect.innerHTML=details.sizes.map(size=>`<option value="${size}">${size}${details.sellingPrices?` - Selling price ${money(details.sellingPrices[size])}`:""}</option>`).join("");}

function discountFor(months){if(months===1)return 1;if(months<=3)return .94;if(months<=6)return .88;if(months<=12)return .78;if(months<=18)return .73;return .68;}
function monthlyRentalPrice(item,months){const sizeRates=details.rentalRatesBySize&&details.rentalRatesBySize[sizeSelect.value];const rates=sizeRates||item.rentalRates;if(rates)return rates.find(rate=>months<=rate.max).price;return Math.round(item.price*discountFor(months));}
function money(value){return `RM${value.toLocaleString("en-MY")}`;}
function paymentLabel(index){return index===0?"On delivery":`Month ${index+1}`;}
function renderSchedule(){
  const months=Number(termSelect.value);const monthly=monthlyRentalPrice(product,months);const total=monthly*months;
  document.querySelector("#monthlyPrice").textContent=`${money(monthly)} / month`;
  document.querySelector("#rentalTotal").textContent=money(total);
  document.querySelector("#scheduleSummary").innerHTML=`<div><span>Plan length</span><strong>${months} ${months===1?"month":"months"}</strong></div><div><span>Monthly payment</span><strong>${money(monthly)}</strong></div><div><span>Total</span><strong>${money(total)}</strong></div>`;
  document.querySelector("#scheduleBody").innerHTML=Array.from({length:months},(_,index)=>`<tr><td>${index+1} of ${months}</td><td>${paymentLabel(index)}</td><td>${money(monthly)}</td></tr>`).join("");
}

termSelect.addEventListener("change",renderSchedule);
sizeSelect.addEventListener("change",renderSchedule);
const agreementCheck=document.querySelector("#agreementCheck");const enquireButton=document.querySelector("#enquireButton");
agreementCheck.addEventListener("change",()=>{enquireButton.disabled=!agreementCheck.checked;});
enquireButton.addEventListener("click",()=>{const months=Number(termSelect.value);const monthly=monthlyRentalPrice(product,months);const size=details.sizes?`\nSize: ${sizeSelect.value}`:"";const message=`Hi Supreme Office Rentals, I'd like to request this rental:\n\n${product.name}\nColour: ${selectedColour}${size}\nRental period: ${months} month${months===1?"":"s"}\nMonthly rental: ${money(monthly)}\nTotal: ${money(monthly*months)}\n\nI have reviewed the rental terms. Please confirm availability and delivery.`;window.open(`https://wa.me/601154209676?text=${encodeURIComponent(message)}`,"_blank","noopener");});

const dropdown=document.querySelector(".nav-dropdown");const dropdownToggle=document.querySelector(".nav-dropdown-toggle");
dropdownToggle.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");dropdownToggle.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",event=>{if(!dropdown.contains(event.target)){dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}});
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
renderSchedule();
