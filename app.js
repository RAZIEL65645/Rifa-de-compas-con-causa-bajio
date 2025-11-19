// --------- MENU MOBILE BURGUER ---------
const menuToggle = document.getElementById('menu-toggle');
const navMobile = document.getElementById('nav-mobile');
if(menuToggle && navMobile){
  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('show');
    menuToggle.innerHTML = navMobile.classList.contains('show') ? '✖' : '&#9776;';
  });
}

// ------ NÚMEROS DE LA RIFA: 0000-9999 ------
const numbersGrid = document.getElementById("numbers-grid");
const inputSearch = document.getElementById("num-search");
const luckyBtn = document.getElementById("lucky-btn");

let cart = [];
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

function selectNum(num){
  if (cart.includes(num)) {
    cart = cart.filter(n => n !== num);
  } else {
    if (cart.length >= 100) {
      alert("Solo puedes seleccionar hasta 100 números por carrito.");
      return;
    }
    cart.push(num);
  }
  renderNumbers(visibleNumbers);
}

// -------- MODAL MAQUINITA DE LA SUERTE --------
const modalLuck = document.getElementById('modal-luck');
const slotAnim = document.getElementById('slot-anim');
const luckResult = document.getElementById('luck-result');
const luckCount = document.getElementById('luck-count');
const luckSpinBtn = document.getElementById('luck-spin-btn');
const luckConfirmBtn = document.getElementById('luck-confirm-btn');
const datosWspForm = document.getElementById('datos-wsp-form');
const clienteNombre = document.getElementById('cliente-nombre');
const enviarWspBtn = document.getElementById('enviar-wsp-btn');

// Abrir modal
document.getElementById('lucky-btn').addEventListener('click', ()=>{
  buildLuckOptions();
  modalLuck.classList.add('active');
  slotAnim.textContent = '';
  luckResult.textContent = '';
  luckConfirmBtn.style.display = "none";
  datosWspForm.style.display = "none";
  clienteNombre.value = '';
  luckPicked = [];
});

// Cerrar modal
document.getElementById('modal-luck-close').addEventListener('click', ()=>{
  modalLuck.classList.remove('active');
});
modalLuck.addEventListener('click', (e)=>{
  if(e.target === modalLuck)
    modalLuck.classList.remove('active');
});

// Construye opciones de cantidad para la maquinita (1 a 100)
function buildLuckOptions(){
  luckCount.innerHTML = '';
  for(let i=1;i<=100;i++){
    let o = document.createElement('option');
    o.value = i;
    o.textContent = `${i} boleto${i>1?'s':''}`;
    luckCount.appendChild(o);
  }
}

// Función para obtener N números libres al azar
function getRandomAvailable(count) {
  let disponibles = allNumbers.filter(n =>
    !cart.includes(n) &&
    !occupiedNumbers.includes(Number(n))
  );
  if (disponibles.length < count) return [];
  let resultado = [];
  for(let i=0;i<count;i++) {
    let idx = Math.floor(Math.random() * disponibles.length);
    resultado.push(disponibles[idx]);
    disponibles.splice(idx, 1);
  }
  return resultado;
}

let luckPicked = [];

luckSpinBtn.onclick = function() {
  const howmany = parseInt(luckCount.value, 10);
  // Validar libres
  let disponibles = allNumbers.filter(n =>
    !cart.includes(n) &&
    !occupiedNumbers.includes(Number(n))
  );
  if(disponibles.length < howmany) {
    luckResult.innerHTML = 'No hay suficientes números disponibles';
    luckConfirmBtn.style.display = "none";
    slotAnim.textContent = '';
    datosWspForm.style.display = "none";
    return;
  }
  luckConfirmBtn.style.display = "none";
  datosWspForm.style.display = "none";
  let totalSteps = 12 + Math.floor(Math.random()*6);
  let run = 0;
  let animInt = setInterval(()=>{
    let picks = getRandomAvailable(howmany);
    slotAnim.textContent = picks.join(', ');
    run++;
    if(run>=totalSteps){
      clearInterval(animInt);
      luckPicked = picks;
      luckResult.innerHTML = '<b>'+picks.join(', ')+'</b>';
      luckConfirmBtn.textContent = "¡LOS QUIERO!";
      luckConfirmBtn.style.display = "inline-block";
    }
  }, 80);
};

// Mostramos el formulario al dar click en LOS QUIERO
luckConfirmBtn.onclick = function() {
  if(!luckPicked.length) return;
  datosWspForm.style.display = 'block';
};

// Si el usuario abre de nuevo la maquinita, oculta el form
document.getElementById('lucky-btn').addEventListener('click', ()=>{
  if(datosWspForm) datosWspForm.style.display = 'none';
  if(clienteNombre) clienteNombre.value = '';
});

// Al hacer click en enviar a WhatsApp
enviarWspBtn.onclick = function() {
  const nombre = clienteNombre.value.trim();
  if(nombre.length < 5){
    alert('Por favor escribe tu nombre completo.');
    return;
  }
  // Mensaje WA
  const boletos = luckPicked.length;
  const numeros = luckPicked.join(' *');
  const mensaje = `Hola, Aparte números para FORD LOBO PLATINUM!!

———————————— 
🎟 *${boletos} BOLETOS:* *${luckPicked.join('* ')}*
*Nombre:* ${nombre} 

🎫 1 POR $17
2 POR $34
4 POR $68
6 POR $102
7 POR $119
9 POR $153
PRECIO ESPECIAL:
10 POR $159
20 POR $318
30 POR $477
———————————— 
⯯*CUENTAS DE PAGO AQUÍ:* www.rifadecompasconcausabajío.com/pagos
*Celular:* 4761328415

El siguiente paso es enviar foto del comprobante de pago por aquí`;

  const wspurl = "https://wa.me/524761328415?text=" + encodeURIComponent(mensaje);
  window.open(wspurl, "_blank");
  // Añadir los boletos al carrito
  luckPicked.forEach(n => {
    if(!cart.includes(n) && !occupiedNumbers.includes(Number(n))) cart.push(n);
  });
  renderNumbers(visibleNumbers);
  modalLuck.classList.remove('active');
  datosWspForm.style.display = "none";
  luckConfirmBtn.style.display = "none";
};

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
