const dropdown=document.querySelector(".nav-dropdown");
const dropdownToggle=document.querySelector(".nav-dropdown-toggle");
dropdownToggle.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");dropdownToggle.setAttribute("aria-expanded",String(open));});
document.addEventListener("click",event=>{if(!dropdown.contains(event.target)){dropdown.classList.remove("open");dropdownToggle.setAttribute("aria-expanded","false");}});
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});

const chapters=[...document.querySelectorAll(".process-chapter")];
const markers=[...document.querySelectorAll("[data-step-target]")];
const activeNumber=document.querySelector("#activeStepNumber");
const activeTitle=document.querySelector("#activeStepTitle");
const progressFill=document.querySelector(".process-rail-fill");

function setActiveStep(index){
  chapters.forEach((chapter,chapterIndex)=>chapter.classList.toggle("active",chapterIndex===index));
  markers.forEach((marker,markerIndex)=>marker.classList.toggle("active",markerIndex===index));
  activeNumber.textContent=chapters[index].dataset.step;
  activeTitle.textContent=chapters[index].dataset.title;
  progressFill.style.height=`${index/(chapters.length-1)*100}%`;
}

markers.forEach((marker,index)=>marker.addEventListener("click",()=>chapters[index].scrollIntoView({behavior:"smooth",block:"center"})));

if("IntersectionObserver" in window){
  const chapterObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)setActiveStep(chapters.indexOf(visible.target));
  },{rootMargin:"-24% 0px -34% 0px",threshold:[.15,.35,.6]});
  chapters.forEach(chapter=>chapterObserver.observe(chapter));
}
