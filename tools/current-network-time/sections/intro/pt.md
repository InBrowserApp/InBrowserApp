## Para que serve esta ferramenta

Use esta ferramenta para comparar o relogio do seu dispositivo com um horario
obtido pela rede. Ela busca um timestamp no endpoint de trace da Cloudflare,
estima o ponto medio da latencia e mostra o relogio de rede no navegador.

## Onde ela ajuda

- Verificar se o relogio local do sistema esta adiantado ou atrasado.
- Confirmar desvio de horario antes de investigar TLS, tokens, agendadores ou
  logs.
- Obter rapidamente uma referencia de horario baseada na rede sem instalar
  ferramentas de NTP.

## O que observar

- O offset exibido e uma estimativa e depende da latencia de rede.
- Se a requisicao de trace falhar, a ferramenta volta a mostrar o relogio
  local ate a proxima sincronizacao bem-sucedida.
- Para uma correcao precisa no sistema inteiro, ajuste a sincronizacao de hora
  do dispositivo ou a configuracao de NTP.
