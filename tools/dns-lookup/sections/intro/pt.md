Consulta DNS verifica os registros DNS públicos retornados para um nome de domínio. Ela é útil quando você está verificando o lançamento de um novo site, depurando entrega de e-mails, conferindo mudanças de CDN ou balanceador de carga, ou confirmando se respostas relacionadas a DNSSEC parecem diferentes entre resolvedores.

## Quando usar

Use esta ferramenta quando precisar de uma resposta rápida no navegador para tipos comuns de registro DNS. Registros A e AAAA mostram destinos IPv4 e IPv6, registros CNAME mostram aliases, registros MX identificam servidores de e-mail, registros TXT frequentemente contêm SPF ou tokens de verificação, e registros NS/SOA/CAA/SRV/HTTPS/SVCB expõem delegação, autoridade, certificado, serviço e dicas modernas de endpoint.

## Como funciona

A consulta é executada no seu navegador com DNS over HTTPS. Escolha um resolvedor, selecione um ou mais tipos de registro e envie um domínio ou URL. URLs são normalizadas para o hostname antes que a consulta seja enviada, portanto colar `https://www.example.com/path` consulta `www.example.com`.

## Como ler os resultados

Cada tipo de registro é exibido separadamente com o código de resposta DNS, flags do resolvedor, linhas de resposta e JSON bruto. `NoError` significa que o servidor DNS respondeu com sucesso, mas ele ainda pode não retornar linhas de resposta para um tipo específico. `NXDomain`, `ServFail` ou `Refused` geralmente significa que o nome não existe, que o resolvedor não conseguiu concluir a consulta ou que a política do resolvedor bloqueou a solicitação.

## Privacidade e limitações

As consultas são enviadas para o resolvedor DNS over HTTPS selecionado, não para um servidor InBrowser.App. O comportamento do resolvedor, o estado do cache, a validação DNSSEC e a filtragem da rede local podem afetar os resultados. Esta ferramenta não substitui verificações autoritativas com `dig` a partir de várias redes, mas é uma forma rápida de inspecionar o que resolvedores DoH públicos retornam a partir do seu navegador atual.
