const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SCALE = 50;

let terrain = {
  w: 10,
  h: 20
};

let elements = [];

let selected = null;

let tool = "select";

let dragging = false;

let dragStart = null;


// ==========================
// TAMANHO DO CANVAS
// ==========================

function resize() {

  canvas.width =
    Math.max(700, terrain.w * SCALE + 80);

  canvas.height =
    Math.max(700, terrain.h * SCALE + 80);

  draw();
}


// ==========================
// GRADE
// ==========================

function grid() {

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.strokeStyle = "#e7ebf0";

  ctx.lineWidth = 1;


  // Linhas verticais

  for (
    let x = 40;
    x < 40 + terrain.w * SCALE;
    x += SCALE
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 40);

    ctx.lineTo(
      x,
      40 + terrain.h * SCALE
    );

    ctx.stroke();
  }


  // Linhas horizontais

  for (
    let y = 40;
    y < 40 + terrain.h * SCALE;
    y += SCALE
  ) {

    ctx.beginPath();

    ctx.moveTo(40, y);

    ctx.lineTo(
      40 + terrain.w * SCALE,
      y
    );

    ctx.stroke();
  }


  // Terreno

  ctx.strokeStyle = "#111827";

  ctx.lineWidth = 3;

  ctx.strokeRect(
    40,
    40,
    terrain.w * SCALE,
    terrain.h * SCALE
  );


  // Medidas

  ctx.fillStyle = "#667085";

  ctx.font = "11px Arial";


  for (
    let i = 0;
    i <= terrain.w;
    i++
  ) {

    ctx.fillText(
      i + "m",
      40 + i * SCALE - 7,
      32
    );

  }


  for (
    let i = 0;
    i <= terrain.h;
    i++
  ) {

    ctx.fillText(
      i + "m",
      10,
      44 + i * SCALE
    );

  }

}


// ==========================
// DESENHAR
// ==========================

function draw() {

  grid();


  elements.forEach((e, i) => {

    ctx.save();


    // PAREDE

    if (e.type === "wall") {

      ctx.strokeStyle = "#202938";

      ctx.lineWidth = 8;

      ctx.beginPath();

      ctx.moveTo(
        e.x * SCALE + 40,
        e.y * SCALE + 40
      );

      ctx.lineTo(
        (e.x + e.w) * SCALE + 40,
        (e.y + e.h) * SCALE + 40
      );

      ctx.stroke();

    }


    // OBJETOS

    else {

      if (e.type === "door") {

        ctx.fillStyle = "#d6a36a";

      }

      else if (e.type === "window") {

        ctx.fillStyle = "#7dd3fc";

      }

      else if (e.type === "room") {

        ctx.fillStyle = "#eef2ff";

      }

      else {

        ctx.fillStyle = "#d1d5db";

      }


      ctx.strokeStyle = "#344054";

      ctx.lineWidth = 2;


      ctx.fillRect(
        e.x * SCALE + 40,
        e.y * SCALE + 40,
        e.w * SCALE,
        e.h * SCALE
      );


      ctx.strokeRect(
        e.x * SCALE + 40,
        e.y * SCALE + 40,
        e.w * SCALE,
        e.h * SCALE
      );


      ctx.fillStyle = "#344054";

      ctx.font = "12px Arial";


      ctx.fillText(
        e.label,
        e.x * SCALE + 45,
        e.y * SCALE + 58
      );

    }


    // SELEÇÃO

    if (selected === i) {

      ctx.strokeStyle = "#2563eb";

      ctx.lineWidth = 2;

      ctx.setLineDash([
        6,
        4
      ]);

      ctx.strokeRect(
        e.x * SCALE + 34,
        e.y * SCALE + 34,
        e.w * SCALE + 12,
        e.h * SCALE + 12
      );

      ctx.setLineDash([]);

    }

    ctx.restore();

  });

}


// ==========================
// POSIÇÃO DO MOUSE / DEDO
// ==========================

function pos(ev) {

  const r =
    canvas.getBoundingClientRect();

  return {

    x:
      (ev.clientX -
        r.left -
        40) / SCALE,

    y:
      (ev.clientY -
        r.top -
        40) / SCALE

  };

}


// ==========================
// ADICIONAR OBJETO
// ==========================

function add(
  type,
  x,
  y,
  w,
  h,
  label
) {

  elements.push({

    type,

    x,

    y,

    w,

    h,

    label

  });


  selected =
    elements.length - 1;


  updateProps();

  draw();

}


// ==========================
// ENCONTRAR OBJETO
// ==========================

function hit(p) {

  for (
    let i = elements.length - 1;
    i >= 0;
    i--
  ) {

    const e = elements[i];


    if (
      p.x >= e.x - 0.15 &&
      p.x <= e.x + e.w + 0.15 &&
      p.y >= e.y - 0.15 &&
      p.y <= e.y + e.h + 0.15
    ) {

      return i;

    }

  }

  return null;

}


// ==========================
// MOUSE / TOUCH
// ==========================

canvas.addEventListener(
  "pointerdown",
  e => {

    const p = pos(e);


    // PAREDE

    if (tool === "wall") {

      dragging = true;

      dragStart = p;

      return;

    }


    // SELECIONAR

    if (tool === "select") {

      selected = hit(p);

      updateProps();

      draw();

      return;

    }


    // PORTA

    if (tool === "door") {

      add(
        "door",
        p.x,
        p.y,
        0.9,
        0.15,
        "Porta"
      );

    }


    // JANELA

    if (tool === "window") {

      add(
        "window",
        p.x,
        p.y,
        1.2,
        0.15,
        "Janela"
      );

    }


    // CÔMODO

    if (tool === "room") {

      add(
        "room",
        p.x,
        p.y,
        3,
        3,
        "Cômodo"
      );

    }


    // MÓVEL

    if (tool === "furniture") {

      add(
        "furniture",
        p.x,
        p.y,
        1.5,
        0.8,
        "Móvel"
      );

    }

  }
);


canvas.addEventListener(
  "pointerup",
  e => {

    if (!dragging) return;


    const p = pos(e);

    dragging = false;


    const x =
      Math.min(
        dragStart.x,
        p.x
      );

    const y =
      Math.min(
        dragStart.y,
        p.y
      );


    const w =
      Math.abs(
        p.x -
        dragStart.x
      );


    const h =
      Math.abs(
        p.y -
        dragStart.y
      );


    if (
      w > 0.2 ||
      h > 0.2
    ) {

      add(
        "wall",
        x,
        y,
        w,
        h,
        "Parede"
      );

    }

  }
);


// ==========================
// FERRAMENTAS
// ==========================

document
  .querySelectorAll(".tool")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".tool")
        .forEach(x =>
          x.classList.remove("active")
        );


      button.classList.add("active");


      tool =
        button.dataset.tool;


      document
        .getElementById(
          "toolLabel"
        )
        .textContent =
        button.textContent.trim();

    };

  });


// ==========================
// PROPRIEDADES
// ==========================

function updateProps() {

  const empty =
    document.getElementById(
      "emptyProps"
    );

  const props =
    document.getElementById(
      "props"
    );


  if (
    selected === null ||
    !elements[selected]
  ) {

    empty.hidden = false;

    props.hidden = true;

    return;

  }


  empty.hidden = true;

  props.hidden = false;


  const e =
    elements[selected];


  document.getElementById(
    "propType"
  ).value =
    e.label;


  document.getElementById(
    "propX"
  ).value =
    e.x;


  document.getElementById(
    "propY"
  ).value =
    e.y;


  document.getElementById(
    "propW"
  ).value =
    e.w;


  document.getElementById(
    "propH"
  ).value =
    e.h;

}


// ==========================
// ALTERAR PROPRIEDADES
// ==========================

["X", "Y", "W", "H"]
.forEach(k => {

  document
    .getElementById(
      "prop" + k
    )
    .addEventListener(
      "input",
      ev => {

        if (
          selected === null
        ) return;


        elements[selected][
          k.toLowerCase()
        ] =
          parseFloat(
            ev.target.value
          ) || 0;


        draw();

      }
    );

});


// ==========================
// EXCLUIR
// ==========================

document
  .getElementById(
    "deleteElement"
  )
  .onclick = () => {

    if (
      selected !== null
    ) {

      elements.splice(
        selected,
        1
      );

      selected = null;

      updateProps();

      draw();

    }

  };


// ==========================
// TERRENO
// ==========================

document
  .getElementById(
    "applyTerrain"
  )
  .onclick = () => {

    terrain.w =
      Math.max(
        1,
        parseFloat(
          document.getElementById(
            "terrainW"
          ).value
        ) || 10
      );


    terrain.h =
      Math.max(
        1,
        parseFloat(
          document.getElementById(
            "terrainH"
          ).value
        ) || 20
      );


    resize();

  };


// ==========================
// NOME
// ==========================

document
  .getElementById(
    "nameInput"
  )
  .addEventListener(
    "input",
    e => {

      document.getElementById(
        "projectName"
      ).textContent =
        e.target.value ||
        "Projeto sem nome";

    }
  );


// ==========================
// LIMPAR
// ==========================

document
  .getElementById(
    "clearCanvas"
  )
  .onclick = () => {

    if (
      confirm(
        "Limpar todos os elementos?"
      )
    ) {

      elements = [];

      selected = null;

      updateProps();

      draw();

    }

  };


// ==========================
// NOVO PROJETO
// ==========================

document
  .getElementById(
    "newProject"
  )
  .onclick = () => {

    if (
      confirm(
        "Começar um novo projeto?"
      )
    ) {

      elements = [];

      selected = null;

      document.getElementById(
        "nameInput"
      ).value =
        "Minha Casa";


      document.getElementById(
        "projectName"
      ).textContent =
        "Minha Casa";


      updateProps();

      draw();

    }

  };


// ==========================
// SALVAR
// ==========================

document
  .getElementById(
    "saveProject"
  )
  .onclick = () => {

    const data = {

      name:
        document.getElementById(
          "nameInput"
        ).value,

      terrain,

      elements

    };


    localStorage.setItem(
      "goncalves-arquitetura",
      JSON.stringify(data)
    );


    document.getElementById(
      "status"
    ).textContent =
      "Projeto salvo neste dispositivo.";

  };


// ==========================
// EXPORTAR PNG
// ==========================

document
  .getElementById(
    "exportProject"
  )
  .onclick = () => {

    const a =
      document.createElement(
        "a"
      );


    a.download =
      "planta-arquitetura.png";


    a.href =
      canvas.toDataURL(
        "image/png"
      );


    a.click();

  };


// ==========================
// CARREGAR PROJETO
// ==========================

const saved =
  localStorage.getItem(
    "goncalves-arquitetura"
  );


if (saved) {

  try {

    const d =
      JSON.parse(saved);


    terrain =
      d.terrain ||
      terrain;


    elements =
      d.elements ||
      [];


    document.getElementById(
      "nameInput"
    ).value =
      d.name ||
      "Minha Casa";


    document.getElementById(
      "projectName"
    ).textContent =
      d.name ||
      "Minha Casa";

  }

  catch (error) {

    console.log(
      "Erro ao carregar projeto"
    );

  }

}


// ==========================
// INICIAR
// ==========================

resize();

updateProps();
