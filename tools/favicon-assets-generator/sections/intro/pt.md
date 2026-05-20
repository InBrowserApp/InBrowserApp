## O que a ferramenta gera

Este gerador transforma uma única imagem num pacote completo e moderno de
favicons — um `.ico` multitamanho para navegadores antigos, as variantes
PNG de 16 / 32 / 180 / 192 / 512, um `.svg` original opcional, um
`site.webmanifest` para PWAs e o trecho HTML que você cola em `<head>`.
Cada byte é produzido no seu navegador; sem upload, sem servidor, sem
analytics.

## O que vem no pacote

- `favicon.ico` — multi-imagem (16 / 32 / 48) para abas do navegador,
  favoritos e atalhos antigos do Windows.
- `favicon-16x16.png` e `favicon-32x32.png` — variantes PNG modernas usadas
  pelos navegadores atuais.
- `favicon.svg` — incluído apenas quando sua imagem de origem é SVG e a
  opção "Usar SVG original" está ativada.
- `apple-touch-icon.png` — 180×180, opaco, usado pelas telas iniciais do
  iOS.
- `pwa-192x192.png` e `pwa-512x512.png` — os ícones PWA padrão.
- `pwa-maskable-192x192.png` e `pwa-maskable-512x512.png` — variantes
  mascaráveis com a área segura recomendada pelo W3C.
- `site.webmanifest` — o manifesto PWA conectado aos ícones acima.

## Como funcionam o preenchimento, o plano de fundo e as zonas seguras mascaráveis

Cada plataforma tem seu próprio preenchimento ("Margem") para que você possa
deixar espaço de respiro dentro da tela do ícone. O interruptor "Adicionar
plano de fundo" pinta um quadrado opaco atrás da sua imagem de origem —
útil quando a origem é transparente e o destino exige opacidade (a tela
inicial da Apple) ou simplesmente para contraste visual em uma aba do
navegador. Os ícones PWA mascaráveis usam uma zona segura adicional sobre
a margem da plataforma: qualquer coisa fora dos ~80% centrais pode ser
recortada pelo Android, Windows ou ChromeOS quando eles aplicam uma máscara
circular, arredondada ou em formato de squircle.

## Integrando o pacote ao seu site

1. Descompacte o arquivo baixado na raiz da sua web (de modo que os
   arquivos fiquem em `/favicon.ico`, `/site.webmanifest`, etc.).
2. Cole o trecho HTML no `<head>` do seu site.
3. Se você servir os ativos a partir de um subcaminho (por exemplo
   `/static/icons/`), defina "Caminho dos ativos" antes de gerar para que
   o trecho e o manifesto usem as URLs corretas.
4. Se você personalizou o manifesto além do que esta ferramenta expõe (por
   exemplo, para adicionar `categories` ou `screenshots`), abra
   `site.webmanifest` em um editor de texto e edite diretamente — é JSON
   puro.
