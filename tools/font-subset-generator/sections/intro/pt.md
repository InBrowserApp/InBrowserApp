## O que é um subconjunto de fonte?

Um subconjunto de fonte contém os caracteres necessários para um determinado
texto, além dos glifos de apoio exigidos para renderizá-los. Remover glifos não
utilizados pode reduzir bastante o tamanho das fontes baixadas, principalmente
em fontes grandes de chinês, japonês e coreano ou em um título fixo, logotipo ou
página de campanha.

## Como usar esta ferramenta

Escolha um arquivo TTF, OTF, WOFF ou WOFF2 e cole todo o texto que o utilizará.
Escolha WOFF2 para uso na web ou TTF / OTF para uma fonte sem compressão e gere
o subconjunto. Compare os tamanhos, verifique a pré-visualização e baixe a fonte
e o CSS correspondente. O processamento da fonte ocorre localmente em um Web Worker.

## O que é preservado?

O HarfBuzz mantém as dependências entre glifos e os recursos de layout OpenType
necessários para ligaduras, kerning, marcas combinantes e sistemas de escrita
complexos. O hinting e os eixos de fontes variáveis são preservados. As formas
compostas e decompostas canonicamente equivalentes do texto são incluídas quando
a fonte original oferece suporte a elas. A pré-visualização usa a fonte gerada,
e os caracteres ausentes na fonte original são listados separadamente.

## Dicas práticas

- Inclua espaços, pontuação, números e todas as traduções necessárias.
  Adicione o conjunto latino predefinido se seu texto também contiver caracteres
  latinos básicos.
- Gere novamente o subconjunto sempre que o texto mudar. Um subconjunto fixo é
  mais adequado para conteúdo conhecido; use uma cobertura de caracteres mais
  ampla para textos gerados por usuários.
- A criação de subconjuntos não adiciona caracteres ausentes na fonte original.
  Mantenha uma fonte alternativa no CSS para caracteres fora do subconjunto.
- Use uma fonte cuja licença permita modificações e incorporação na web. As
  coleções de fontes (`.ttc` / `.otc`) devem ser exportadas primeiro como fontes
  individuais.
- Fontes pequenas ou já reduzidas a subconjuntos podem não ficar menores. O
  WOFF2 geralmente oferece o menor tamanho para download na web; a contagem de
  glifos também inclui os glifos de apoio.
