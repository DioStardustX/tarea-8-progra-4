var precioProducto = {
  Flor1: '10350',
  Flor2: '11450',
  Flor3: '10550',
  Flor4: '9550',
  Flor5: '10750',
  Arreglo1: '19000',
  Arreglo2: '20000',
  Arreglo3: '15000',
  Arreglo4: '18000',
  Arreglo5: '13500',
  Caja1: '20000',
  Caja2: '10125',
  Caja3: '12250',
  Caja4: '13250',
  Caja5: '15500'
};

window.onload = cargaInicial();
const $select = document.querySelector('#prov'); //Select de provincia
$select.addEventListener('change', cambioSelect);
const $select1 = document.querySelector('#can'); //Select de Cantones
$select1.addEventListener('change', cambioSelect1);
const $select2 = document.querySelector('#dis'); //Select de distritos
const $selectProducto = document.querySelector('#producto'); //Select de distritos
$selectProducto.addEventListener('change', obtenerPrecio);

const $selectCantidad = document.querySelector('#cantidad');
const $selectTamanio = document.querySelector('#tamanio');

var precio = 0;
async function getProvincias() {
  let url = 'https://ubicaciones.paginasweb.cr/provincias.json';
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getCanton(idProv) {
  let url = `https://ubicaciones.paginasweb.cr/provincia/${idProv}/cantones.json`;

  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getDistritos(idProv, idCanton) {
  let url = `https://ubicaciones.paginasweb.cr/provincia/${idProv}/canton/${idCanton}/distritos.json`;

  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderProvincias() {
  let provincias = await getProvincias();
  let html = '';

  Object.keys(provincias).forEach(key => {
    const option = document.createElement('option');
    const valor = new Date().getTime();
    option.value = key;
    option.text = provincias[key];
    $select.appendChild(option);
  });
}

async function renderCantones(idProv) {
  let cantones = await getCanton(idProv);
  let html = '';

  Object.keys(cantones).forEach(key => {
    const option = document.createElement('option');
    const valor = new Date().getTime();
    option.value = key;
    option.text = cantones[key];
    $select1.appendChild(option);
  });
}

async function renderDistritos(idProv, idCanton) {
  let cantones = await getDistritos(idProv, idCanton);
  let html = '';

  Object.keys(cantones).forEach(key => {
    const option = document.createElement('option');
    const valor = new Date().getTime();
    option.value = key;
    option.text = cantones[key];
    $select2.appendChild(option);
  });
}

function cargaInicial() {
  renderProvincias();
}

function cambioSelect() {
  const indice = $select.selectedIndex;
  if (indice === -1) return; // Esto es cuando no hay elementos
  const opcionSeleccionada = $select.options[indice];
  renderCantones(opcionSeleccionada.value);
}
function cambioSelect1() {
  const idProv = $select.selectedIndex;
  const idCanton = $select1.selectedIndex;
  if (idProv === -1 || idCanton == -1) return; // Esto es cuando no hay elementos
  const opcionProv = $select.options[idProv];
  const opcionDist = $select1.options[idCanton];

  renderDistritos(opcionProv.value, opcionDist.value);
}

function obtenerPrecio(codigo) {
  const indice = $selectProducto.selectedIndex;
  if (indice === -1) return; // Esto es cuando no hay elementos
  const opcionSeleccionada = $selectProducto.options[indice].value; //Obtenemos el value del select

  Object.keys(precioProducto).forEach(keys => {
    if (keys == opcionSeleccionada) {
      precio = precioProducto[keys];
      // console.log(precioProducto[keys]);
    }
  });
}

function registrarProducto() {
  const indicePr = $selectProducto.options[$selectProducto.selectedIndex].text;
  const indiceCan =
    $selectCantidad.options[$selectCantidad.selectedIndex].value;
  const indiceTam = $selectTamanio.options[$selectTamanio.selectedIndex].value;
  console.log(indiceTam);
  const total = calcularPrecio(precio, indiceTam, indiceCan);

  document.getElementById('datos').insertRow(-1).innerHTML = `
    <td>${indiceCan}</td>
    <td>${indicePr}</td>
    <td>${indiceTam}</td>
    <td>${precio}</td>
    <td>${total}</td>`;
}

function calcularPrecio(precio, tam, cant) {
  subtotal = precio * cant;
  aux = 0;
  if (tam.toLowerCase() == 'medium') {
    aux = subtotal * 0.1;
    subtotal = subtotal + aux;
  }
  if (tam.toLowerCase() == 'large') {
    aux = subtotal * 0.15;
    subtotal = subtotal + aux;
  }
  return subtotal;
}

function Limpiar() {}
 