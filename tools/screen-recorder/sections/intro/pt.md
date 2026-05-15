# Gravador de tela

Grave uma tela, janela ou aba selecionada pelo navegador sem enviar o vídeo para
um servidor. A ferramenta usa as APIs Screen Capture e MediaRecorder do seu
navegador, portanto a gravação permanece local até você baixá-la.

## Quando usar

Use o gravador para demonstrações curtas, relatórios de bugs, guias passo a
passo, notas de QA ou vídeos internos rápidos quando um fluxo leve no navegador
for suficiente. Você pode pedir ao navegador para incluir áudio da aba ou do
sistema e, opcionalmente, misturar o áudio do microfone antes do início da
gravação.

## Privacidade e suporte do navegador

O navegador decide quais fontes de captura e opções de áudio estão disponíveis.
Alguns navegadores compartilham áudio apenas da aba atual, alguns exigem HTTPS e
outros não oferecem suporte a pausa ou gravação. Se a permissão for negada,
nenhum fluxo será mantido e você poderá tentar novamente com configurações
diferentes.

## Dicas para gravações confiáveis

Feche sessões de captura não relacionadas antes de começar, escolha a menor
fonte útil e faça um teste curto quando o áudio for importante. Baixe o resultado
antes de limpá-lo, porque as gravações ficam armazenadas apenas na sessão atual
da página.
