// Sistema antigo da empresa que nao podemos mexer
class SistemaLegadoBebidas {
  buscarBebidaPorCodigo(codigo) {
    const catalogo = {
      101: { tipo: "Refrigerante", volume: "300 ml" },
      102: { tipo: "Refrigerante", volume: "500 ml" },
      103: { tipo: "Refrigerante", volume: "700 ml" },
      201: { tipo: "Suco", volume: "300 ml" },
      202: { tipo: "Suco", volume: "500 ml" },
      203: { tipo: "Suco", volume: "700 ml" },
    };

    if (catalogo[codigo]) {
      return catalogo[codigo];
    }
    throw new Error(`Codigo ${codigo} invalido.`);
  }
}

// Classe base para padronizar as bebidas novas
class Bebida {
  getDescricao() {
    throw new Error("Metodo precisa ser implementado");
  }
}

class Refrigerante extends Bebida {
  constructor(tamanho) {
    super();
    this.tamanho = tamanho;
  }

  getDescricao() {
    return `Refrigerante ${this.tamanho}`;
  }
}

class Suco extends Bebida {
  constructor(tamanho) {
    super();
    this.tamanho = tamanho;
  }

  getDescricao() {
    return `Suco ${this.tamanho}`;
  }
}

// Adapter para converter o codigo numerico do legado no formato que o combo aceita
class BebidaLegadaAdapter extends Bebida {
  constructor(codigo, sistemaLegado) {
    super();
    this.sistemaLegado = sistemaLegado;
    this.dados = this.sistemaLegado.buscarBebidaPorCodigo(codigo);
  }

  getDescricao() {
    return `${this.dados.tipo} ${this.dados.volume} (Sistema Antigo)`;
  }
}

class BatataFrita {
  constructor(tamanho) {
    this.tamanho = tamanho;
  }

  getDescricao() {
    return `Batata ${this.tamanho}`;
  }
}

// Ponte (Bridge): junta o lanche com a bebida e a batata por composicao
class Combo {
  constructor(bebida, batata) {
    this.bebida = bebida;
    this.batata = batata;
  }

  // Metodos para trocar os itens se o cliente quiser personalizar depois
  setBebida(bebida) {
    this.bebida = bebida;
  }

  setBatata(batata) {
    this.batata = batata;
  }

  getLanche() {
    throw new Error("Implementar nas subclasses");
  }

  detalhes() {
    return `${this.getLanche()} + ${this.bebida.getDescricao()} + ${this.batata.getDescricao()}`;
  }
}

// Tipos de combos fixando o lanche
class ComboBigMac extends Combo {
  getLanche() {
    return "Big Mac";
  }
}

class ComboQuarteirao extends Combo {
  getLanche() {
    return "Quarteirao";
  }
}

class ComboMcFish extends Combo {
  getLanche() {
    return "McFish";
  }
}

//Testes no terminal
const sistemaLegado = new SistemaLegadoBebidas();

// 1. Criando 5 combos diferentes usando o Bridge
const combo1 = new ComboBigMac(new Refrigerante("500 ml"), new BatataFrita("Media"));
const combo2 = new ComboQuarteirao(new Suco("300 ml"), new BatataFrita("Grande"));
const combo3 = new ComboMcFish(new Refrigerante("700 ml"), new BatataFrita("Pequena"));
const combo4 = new ComboBigMac(new Suco("500 ml"), new BatataFrita("Grande"));
const combo5 = new ComboQuarteirao(new Refrigerante("300 ml"), new BatataFrita("Media"));

console.log("=== Pedidos Iniciais ===");
console.log("Combo 1:", combo1.detalhes());
console.log("Combo 2:", combo2.detalhes());
console.log("Combo 3:", combo3.detalhes());
console.log("Combo 4:", combo4.detalhes());
console.log("Combo 5:", combo5.detalhes());

// 2. Trocando os acompanhamentos do combo 1 durante a execucao
console.log("\n=== Modificando o Combo 1 ===");
combo1.setBebida(new Suco("700 ml"));
combo1.setBatata(new BatataFrita("Grande"));
console.log("Combo 1 modificado:", combo1.detalhes());

// 3. Montando combo com bebida puxada pelo Adapter (codigo 202 = Suco 500 ml)
console.log("\n=== Teste com Bebida Legada ===");
const bebidaDoLegado = new BebidaLegadaAdapter(202, sistemaLegado);
const comboLegado = new ComboMcFish(bebidaDoLegado, new BatataFrita("Media"));
console.log("Combo com bebida adaptada:", comboLegado.detalhes());