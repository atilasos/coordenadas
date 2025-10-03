export const adventures = [
  {
    id: "fogo-montanha",
    title: "O Feiticeiro da Montanha de Fogo",
    introduction:
      "És um aventureiro audaz em busca do lendário tesouro guardado pelo feiticeiro Zagor na Montanha de Fogo. Cada coordenada representa um caminho em túneis serpenteantes. Escolhe com sabedoria, pois armadilhas e segredos esperam por ti.",
    nodes: {
      start: {
        text:
          "Chegas à base da Montanha de Fogo. Um portal de pedra mostra três símbolos: chama, punho e estrela. As runas brilham em três azulejos do piso.",
        choices: [
          {
            label: "Chama incandescente",
            coordinate: { x: 3, y: 2 },
            next: "sala-chamas",
          },
          {
            label: "Punho selado",
            coordinate: { x: 5, y: 6 },
            next: "galeria-punho",
          },
          {
            label: "Estrela de seis pontas",
            coordinate: { x: 8, y: 4 },
            next: "estrela-guia",
          },
        ],
      },
      "sala-chamas": {
        text:
          "Empurras a laje e uma câmara envolta em calor abre-se. No centro, um braseiro com brasas verdes. Ao lado, dois corredores divergentes.",
        choices: [
          {
            label: "Corredor iluminado",
            coordinate: { x: 2, y: 7 },
            next: "sala-eco",
          },
          {
            label: "Escadaria em espiral",
            coordinate: { x: 6, y: 1 },
            next: "escadaria-espiral",
          },
        ],
      },
      "galeria-punho": {
        text:
          "O corredor conduz-te a uma galeria de esculturas guerreiras. Uma voz gutural ressoa perguntando a tua coragem.",
        choices: [
          {
            label: "Declarar bravura",
            coordinate: { x: 4, y: 9 },
            next: "sala-eco",
          },
          {
            label: "Silêncio respeitoso",
            coordinate: { x: 9, y: 5 },
            next: "câmara-selada",
          },
        ],
      },
      "estrela-guia": {
        text:
          "Segues a luz da estrela e encontras um lago subterrâneo. Um barqueiro encapuzado oferece passagem.",
        choices: [
          {
            label: "Aceitar a travessia",
            coordinate: { x: 7, y: 8 },
            next: "câmara-selada",
          },
          {
            label: "Contornar o lago",
            coordinate: { x: 1, y: 3 },
            next: "escadaria-espiral",
          },
        ],
      },
      "sala-eco": {
        text:
          "Uma sala octogonal com portas em todas as direcções. Cada porta ecoa um som diferente.",
        choices: [
          {
            label: "Som de vento",
            coordinate: { x: 5, y: 2 },
            next: "tesouro",
          },
          {
            label: "Batidas metálicas",
            coordinate: { x: 8, y: 8 },
            next: "armadilha",
          },
        ],
      },
      "escadaria-espiral": {
        text:
          "Desces uma escada que parece não ter fim até chegares a uma porta adornada com runas de protecção.",
        choices: [
          {
            label: "Empurrar a porta",
            coordinate: { x: 3, y: 9 },
            next: "tesouro",
          },
          {
            label: "Recitar um encanto",
            coordinate: { x: 10, y: 6 },
            next: "armadilha",
          },
        ],
      },
      "câmara-selada": {
        text:
          "A sala está repleta de espelhos. Cada reflexo mostra-te mais velho. No centro, um pedestal com pergaminhos.",
        choices: [
          {
            label: "Ler os pergaminhos",
            coordinate: { x: 6, y: 5 },
            next: "tesouro",
          },
          {
            label: "Partir um espelho",
            coordinate: { x: 2, y: 2 },
            next: "armadilha",
          },
        ],
      },
      tesouro: {
        text:
          "Encontraste a Câmara do Tesouro! O cofre de Zagor abre-se revelando joias e o lendário martelo Fogo Vivo. Ganhas prestígio máximo!",
        ending: "success",
      },
      armadilha: {
        text:
          "Ao tocares na escolha errada, o chão cede. Uma rede de ossos prende-te até que regresses à entrada. Aprende com a experiência e tenta outra vez!",
        ending: "retry",
      },
    },
  },
];

