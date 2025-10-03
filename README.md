# Ordem dos Exploradores Coordenados

Um jogo de treino de coordenadas cartesianas com atmosfera de RPG infantil, pensado para crianças a partir dos 7 anos e ideal para ser publicado via GitHub Pages.

## Missão

Completa 8 missões no mapa mágico da Floresta das Estrelas. Em cada missão, observa a marcação-chave (coordenada alvo) e escolhe a casa correcta no tabuleiro. Ganha estrelas-guia, desbloqueia habilidades e conquista títulos honoríficos.

## Mecânicas principais

- **Energia**: cada missão começa com 3 energias. Um erro consome 1 energia.
- **Estrelas-guia**: acertos com precisão rendem entre 0,5 e 2 estrelas.
- **Habilidades**:
  - *Faísca de Precisão*: garante 2 estrelas se acertas à primeira.
  - *Escudo de Quadrícula*: permite usar uma dica sem gastar energia.
  - *Flor Luminescente*: atinge-te após 3 acertos seguidos e oferece um brilho extra.
- **Dicas**: até 3 por campanha. Mostram a coluna correcta.
- **Títulos**: no final, recebes um título como “Grande Cartógrafo” conforme a pontuação.

## Modo aventura

- Clica em `Iniciar crónica` para entrar numa história interactiva.
- Lê o texto no painel da crónica e identifica as coordenadas indicadas.
- Cada escolha corresponde a uma casa do tabuleiro; segue as instruções para avançar.
- Casas válidas ficam destacadas com um brilho azulado. Coordenadas erradas dão feedback imediato.
- Existem finais de sucesso (tesouro) e finais de falha (armadilha). No sucesso é mostrado um resumo; numa armadilha podes tentar novamente.

## Como jogar

1. Abre `index.html` num navegador moderno.
2. Lê a marcação-chave no painel principal.
3. Conta a partir do canto inferior esquerdo: primeiro eixo **X**, depois eixo **Y**.
4. Usa as energias e dicas com cuidado.
5. Activa habilidades sempre que o botão estiver disponível.
6. Completa as 8 missões e descobre o teu título.

## Publicar no GitHub Pages

1. Faz commit das alterações.
2. Em “Settings” → “Pages”, selecciona a branch `main` e a pasta `/`.
3. Guarda e aguarda a publicação automática.

## Personalização sugerida

- Ajusta o tamanho da grelha (`GRID_SIZE`) em `script.js` para escalar desafios.
- Experimenta novas habilidades no livro de feitiços.
- Altera a paleta em `styles.css` para adaptar à identidade visual da escola.
- Acrescenta novas aventuras editando `adventure_data.js`, seguindo a estrutura de `nodes` (cada nó possui texto, escolhas e finais).

---

Feito com imaginação e coordenadas para pequenas grandes exploradoras. ✨

