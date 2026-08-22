import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import {
  OrbitControls
} from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";


/* =========================
   CENA
========================= */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(
    0x9db4aa
  );


/* =========================
   CÂMERA
========================= */

const camera =
  new THREE.PerspectiveCamera(
    48,
    window.innerWidth /
    window.innerHeight,
    0.1,
    200
  );

camera.position.set(
  15,
  13,
  18
);


/* =========================
   RENDER
========================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true
  });

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.shadowMap.enabled = true;


document
  .querySelector("#view")
  .appendChild(
    renderer.domElement
  );


/* =========================
   CONTROLES
========================= */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping = true;

controls.maxPolarAngle =
  Math.PI / 2.04;


/* =========================
   ILUMINAÇÃO
========================= */

const luzAmbiente =
  new THREE.HemisphereLight(
    0xffffff,
    0x405448,
    2
  );

scene.add(luzAmbiente);


const sol =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );

sol.position.set(
  15,
  25,
  10
);

sol.castShadow = true;

scene.add(sol);


/* =========================
   GRUPO DA CASA
========================= */

const casa =
  new THREE.Group();

scene.add(casa);


/* =========================
   MATERIAIS
========================= */

const materiais = {

  terreno:
    new THREE.MeshStandardMaterial({
      color: 0x527b4f
    }),

  parede:
    new THREE.MeshStandardMaterial({
      color: 0xf0ede4
    }),

  piso:
    new THREE.MeshStandardMaterial({
      color: 0xd3cec2
    }),

  teto:
    new THREE.MeshStandardMaterial({
      color: 0x303633,

      transparent: true,

      opacity: 0.18
    }),

  garagem:
    new THREE.MeshStandardMaterial({
      color: 0x202522
    }),

  porta:
    new THREE.MeshStandardMaterial({
      color: 0x7b4d2b
    }),

  piscina:
    new THREE.MeshStandardMaterial({
      color: 0x1599c5,

      roughness: 0.12
    })

};


/* =========================
   CRIAR CUBO
========================= */

function criarCubo(
  x,
  y,
  z,
  largura,
  altura,
  profundidade,
  material
) {

  const geometria =
    new THREE.BoxGeometry(
      largura,
      altura,
      profundidade
    );

  const objeto =
    new THREE.Mesh(
      geometria,
      material
    );

  objeto.position.set(
    x,
    y,
    z
  );

  objeto.castShadow = true;

  objeto.receiveShadow = true;

  casa.add(objeto);

  return objeto;
}


/* =========================
   CRIAR AMBIENTE
========================= */

function criarAmbiente(
  x,
  z,
  largura,
  profundidade
) {

  const altura = 2.7;

  const parede = 0.16;


  criarCubo(
    x,
    altura / 2,
    z - profundidade / 2,
    largura,
    altura,
    parede,
    materiais.parede
  );


  criarCubo(
    x,
    altura / 2,
    z + profundidade / 2,
    largura,
    altura,
    parede,
    materiais.parede
  );


  criarCubo(
    x - largura / 2,
    altura / 2,
    z,
    parede,
    altura,
    profundidade,
    materiais.parede
  );


  criarCubo(
    x + largura / 2,
    altura / 2,
    z,
    parede,
    altura,
    profundidade,
    materiais.parede
  );


  criarCubo(
    x,
    0.05,
    z,
    largura,
    0.1,
    profundidade,
    materiais.piso
  );

}


/* =========================
   LIMPAR CASA
========================= */

function limparCasa() {

  while (
    casa.children.length
  ) {

    casa.remove(
      casa.children[0]
    );

  }

}


/* =========================
   GERAR CASA
========================= */

function gerarCasa() {

  limparCasa();


  const larguraTerreno =
    Number(
      document.querySelector("#w").value
    );


  const comprimentoTerreno =
    Number(
      document.querySelector("#d").value
    );


  const quartos =
    Number(
      document.querySelector("#q").value
    );


  const banheiros =
    Number(
      document.querySelector("#b").value
    );


  const garagem =
    Number(
      document.querySelector("#g").value
    );


  const temPiscina =
    document.querySelector("#pool")
      .checked;


  const temGourmet =
    document.querySelector("#gourmet")
      .checked;


  /* TERRENO */

  criarCubo(
    0,
    -0.15,
    0,

    larguraTerreno + 1,

    0.3,

    comprimentoTerreno + 1,

    materiais.terreno
  );


  /* TAMANHO DA CASA */

  const larguraCasa =
    Math.min(
      larguraTerreno - 0.6,
      Math.max(
        7,
        larguraTerreno * 0.9
      )
    );


  const profundidadeCasa =
    Math.min(
      comprimentoTerreno - 0.6,
      Math.max(
        8,
        comprimentoTerreno * 0.7
      )
    );


  /* FUNDAÇÃO */

  criarCubo(
    0,
    0.04,
    0,

    larguraCasa + 0.25,

    0.12,

    profundidadeCasa + 0.25,

    materiais.garagem
  );


  /* FRENTE */

  const frente =
    garagem > 0
      ? 3.2
      : 4;


  const fundo =
    profundidadeCasa -
    frente;


  /* GARAGEM */

  if (garagem > 0) {

    const larguraGaragem =
      Math.min(
        5.5,
        garagem * 2.7
      );


    for (
      let i = 0;
      i < garagem;
      i++
    ) {

      const x =
        -larguraCasa / 2 +
        (i + 0.5) *
        (
          larguraGaragem /
          garagem
        );


      criarCubo(
        x,
        0.09,

        -profundidadeCasa / 2 +
        frente / 2,

        larguraGaragem /
          garagem -
          0.1,

        0.08,

        frente - 0.1,

        materiais.garagem
      );

    }

  }


  /* SALA */

  const areaUtil =
    larguraCasa -
    (
      garagem > 0
        ? Math.min(
            5.5,
            garagem * 2.7
          )
        : 0
    );


  criarAmbiente(
    0,
    -profundidadeCasa / 2 +
      frente / 2,

    areaUtil * 0.5,

    frente
  );


  /* COZINHA */

  criarAmbiente(
    areaUtil * 0.25,
    -profundidadeCasa / 2 +
      frente / 2,

    areaUtil * 0.5,

    frente
  );


  /* QUARTOS */

  const colunas =
    Math.min(
      3,
      quartos
    );


  const linhas =
    Math.ceil(
      quartos /
      colunas
    );


  const larguraQuarto =
    larguraCasa /
    colunas;


  const profundidadeQuarto =
    fundo /
    linhas;


  for (
    let i = 0;
    i < quartos;
    i++
  ) {

    const coluna =
      i % colunas;

    const linha =
      Math.floor(
        i / colunas
      );


    const x =
      -larguraCasa / 2 +
      larguraQuarto *
      (coluna + 0.5);


    const z =
      -profundidadeCasa / 2 +
      frente +
      profundidadeQuarto *
      (linha + 0.5);


    criarAmbiente(
      x,
      z,

      larguraQuarto,

      profundidadeQuarto
    );

  }


  /* BANHEIROS */

  for (
    let i = 0;
    i < banheiros;
    i++
  ) {

    criarAmbiente(

      larguraCasa / 2 - 1,

      -profundidadeCasa / 2 +
      frente +
      1.5 +
      i * 2.5,

      1.8,

      2.2

    );

  }


  /* ÁREA GOURMET */

  if (
    temGourmet
  ) {

    criarAmbiente(

      larguraCasa / 2 - 1.8,

      profundidadeCasa / 2 -
      1.5,

      3.2,

      2.6

    );

  }


  /* PISCINA */

  if (
    temPiscina
  ) {

    criarCubo(

      0,

      0.06,

      profundidadeCasa / 2 + 3,

      Math.min(
        4.5,
        larguraTerreno * 0.4
      ),

      0.1,

      Math.min(
        6,
        comprimentoTerreno * 0.25
      ),

      materiais.piscina

    );

  }


  /* TETO */

  criarCubo(

    0,

    3.02,

    0,

    larguraCasa + 0.3,

    0.18,

    profundidadeCasa + 0.3,

    materiais.teto

  );


  /* CALÇADA */

  criarCubo(

    0,

    0.02,

    -profundidadeCasa / 2 - 1,

    larguraCasa + 2,

    0.05,

    1.5,

    materiais.piso

  );


  camera.position.set(

    Math.max(
      12,
      larguraTerreno * 1.35
    ),

    Math.max(
      10,
      comprimentoTerreno * 0.7
    ),

    Math.max(
      14,
      comprimentoTerreno * 1.05
    )

  );


  controls.target.set(
    0,
    1,
    0
  );

  controls.update();


  document.querySelector(
    "#status"
  ).textContent =
    `✅ Casa 3D criada — ${larguraTerreno} × ${comprimentoTerreno} m • ${quartos} quartos • ${banheiros} banheiros.`;

}


/* =========================
   BOTÕES
========================= */

document
  .querySelector("#generate")
  .addEventListener(
    "click",
    () => {

      document.querySelector(
        "#status"
      ).textContent =
        "🤖 Construindo projeto 3D...";

      setTimeout(
        gerarCasa,
        500
      );

    }
  );


document
  .querySelector("#reset")
  .addEventListener(
    "click",
    () => {

      camera.position.set(
        15,
        13,
        18
      );

      controls.target.set(
        0,
        1,
        0
      );

      controls.update();

    }
  );


document
  .querySelector("#camera")
  .addEventListener(
    "click",
    () => {

      camera.position.set(
        14,
        11,
        14
      );

      controls.target.set(
        0,
        1,
        0
      );

      controls.update();

    }
  );


/* =========================
   RESPONSIVO
========================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================
   LOOP 3D
========================= */

function animar() {

  requestAnimationFrame(
    animar
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );

}

gerarCasa();

animar();
