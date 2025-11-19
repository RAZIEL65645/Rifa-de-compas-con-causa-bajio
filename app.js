// --------- MENU MOBILE BURGUER ---------
const menuToggle = document.getElementById('menu-toggle');
const navMobile = document.getElementById('nav-mobile');
menuToggle?.addEventListener('click', () => {
  navMobile.classList.toggle('show');
  menuToggle.innerHTML = navMobile.classList.contains('show') ? '✖' : '&#9776;';
});

// ------ NÚMEROS DE LA RIFA: 0000-9999 ------
const numbersGrid = document.getElementById("numbers-grid");
const inputSearch = document.getElementById("num-search");
const luckyBtn = document.getElementById("lucky-btn");

let cart = [];
// Simula ocupados random (puedes actualizar con tu data real)
let occupiedNumbers = [7,11,22,105,600,777,900,1011,2222,3456,4699,7892,8888,9998,2345,1850,4987];
let allNumbers = [];
function buildNumbers() {
  let nums = [];
  for (let i = 0; i < 10000; i++) nums.push(i.toString().padStart(4, "0"));
  return nums;
}
allNumbers = buildNumbers();
let visibleNumbers = [...allNumbers];

function renderNumbers(list = allNumbers) {
  numbersGrid.innerHTML = '';
  list.forEach(num => {
    const div = document.createElement('div');
    div.className = 'number-cell';
    div.textContent = num;
    if (occupiedNumbers.indexOf(Number(num)) !== -1) div.classList.add('occupied');
    if (cart.includes(num)) div.classList.add('selected');
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    if (!div.classList.contains('occupied')) {
      div.addEventListener('click', () => selectNum(num));
      div.addEventListener('keypress', (e) => {if (e.key === "Enter" || e.key === " ") selectNum(num);});
    }
    numbersGrid.appendChild(div);
  });
}
renderNumbers(visibleNumbers);

// BUSQUEDA
inputSearch.addEventListener("input", function(){
  let val = this.value.replace(/\D/g,"").padStart(4,"0");
  if(this.value.length === 0) {
    visibleNumbers = [...allNumbers];
  } else {
    visibleNumbers = allNumbers.filter(n=> n.includes(val));
  }
  renderNumbers(visibleNumbers);
});

// MAQUINITA DE LA SUERTE
luckyBtn.addEventListener("click", ()=>{
  let available = allNumbers.filter(n =>
    !cart.includes(n) && occupiedNumbers.indexOf(Number(n))===-1
  );
  if(available.length === 0) return;
  let pick = available[Math.floor(Math.random()*available.length)];
  selectNum(pick);
  // Scroll automático hasta pick (solo si visible)
  const idx = visibleNumbers.indexOf(pick);
  const childNodes = Array.from(numbersGrid.children);
  if(idx > -1) setTimeout(()=>childNodes[idx]?.scrollIntoView({behavior:"smooth",block:"center"}),130);
});

function selectNum(num){
  if (cart.includes(num)) {
    cart = cart.filter(n => n !== num);
  } else {
    if (cart.length >= 10) {
      alert("Solo puedes seleccionar hasta 10 números por carro.");
      return;
    }
    cart.push(num);
  }
  renderNumbers(visibleNumbers);
}

// --------- Banner "Sorteos Seguros" autoocultar --------
let lastScrollTop = 0;
const bannerSeguro = document.querySelector('.banner-seguro');
window.addEventListener('scroll', function(){
  if(!bannerSeguro) return;
  const st = window.scrollY || document.documentElement.scrollTop;
  if (st > lastScrollTop && st > 150) { // moving down
    bannerSeguro.style.transform = 'translateY(110%)';
  } else { // up
    bannerSeguro.style.transform = 'translateY(0)';
  }
  lastScrollTop = st <= 0 ? 0 : st;
});