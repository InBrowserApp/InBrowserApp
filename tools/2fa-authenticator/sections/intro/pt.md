## Gere um código 2FA a partir de uma chave de configuração ou de um código QR

Abra as configurações de autenticação de dois fatores do site que você quer proteger e escolha a opção de aplicativo autenticador. Carregue ou escaneie o código QR do site ou cole a chave de configuração ou o link `otpauth://` e selecione **Adicionar conta**. Cole o código atual no campo de verificação do site para concluir a configuração.

## Transfira contas de outro autenticador

No Google Authenticator, escolha **Transferir contas** e exporte as contas que você quer mover. Aqui, escaneie os códigos QR de exportação com **Usar câmera** ou carregue as imagens salvas de uma só vez. No [autenticador original da InBrowser.App](https://authenticator.inbrowser.app/), abra **Export**, escolha **Google Authenticator**, baixe a imagem do código QR e carregue-a aqui.

Os códigos QR de transferência do Google são importados com um intervalo de 30 segundos. Para manter os intervalos personalizados do autenticador original, transfira as contas individualmente. Clique na engrenagem de cada conta, expanda **Key URI** em **Config** e cole o link aqui.

As contas são salvas neste navegador. Baixe um backup em **Exportar contas** antes de limpar os dados do site ou mudar de navegador. Guarde o backup em um local privado, pois ele contém suas chaves de configuração.

## Por que meu código de verificação foi recusado?

A maioria dos sites usa códigos que dependem da hora (TOTP). Confira se seu dispositivo ajusta a hora automaticamente. Se o código estiver prestes a expirar, aguarde o próximo. Os códigos baseados em contador (HOTP) continuam iguais até você selecionar **Próximo código**. Em ambos os casos, use o código da conta certa e siga as configurações personalizadas fornecidas pelo site.
