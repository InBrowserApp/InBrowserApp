## O que esta ferramenta faz

O Extrator de paleta de imagens encontra as cores dominantes em uma imagem
diretamente no seu navegador. Ele amostra a imagem, agrupa pixels visualmente
semelhantes e retorna uma paleta prática com valores HEX, RGB, HSL e percentuais
para cada cor.

## Bons casos de uso

- Extrair cores de marca ou produto de uma captura de tela, logotipo, foto ou mockup.
- Criar rapidamente uma paleta CSS para uma landing page, miniatura ou repasse de design.
- Comparar quanto de uma imagem é dominado por uma cor principal em relação a
  acentos de apoio.
- Trabalhar com imagens privadas sem enviar o arquivo para um servidor.

## Opções de exportação

O resultado pode ser copiado como uma lista HEX simples, propriedades
personalizadas CSS ou JSON. O formato CSS é útil quando você quer variáveis como
`--palette-1`, enquanto JSON mantém os formatos de cor e a proporção de
dominância juntos para scripts ou automação de design.

## Pontos de atenção

- A extração da paleta é aproximada. Ela foi pensada para produzir grupos
  visuais úteis, não um inventário completo de todas as cores de cada pixel.
- Pixels transparentes são ignorados por padrão para que ícones e recortes não
  distorçam a paleta; desative isso quando a própria transparência fizer parte
  da arte.
- A configuração de qualidade precisa amostra mais pixels e pode ser mais lenta
  em imagens muito grandes.
