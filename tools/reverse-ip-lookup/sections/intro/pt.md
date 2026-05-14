A Consulta reversa de IP converte um endereço IPv4 ou IPv6 no seu nome de DNS reverso e consulta o registro `PTR` correspondente. Ela ajuda você a verificar qual nome de host o proprietário de um endereço publica para servidores de e-mail, appliances de rede, instâncias de nuvem e notas de solução de problemas.

## O Que Ela Verifica

Para IPv4, a ferramenta inverte os octetos e consulta um nome `in-addr.arpa`. Para IPv6, ela expande o endereço para 32 nibbles hexadecimais, inverte a ordem deles e consulta o nome `ip6.arpa` correspondente. O resultado mostra o domínio exato de DNS reverso, o código de status DNS, o resolvedor, a família de endereços e todos os nomes de host retornados com seus valores de TTL.

## Como a Consulta É Executada

A consulta é executada no seu navegador usando DNS-over-HTTPS. Você pode escolher Cloudflare, Google ou AliDNS como resolvedor, e o navegador envia uma consulta `PTR` padrão para esse endpoint. Nenhum serviço de consulta do InBrowser.App no lado do servidor é envolvido.

## Como Ler Resultados Ausentes

Uma resposta PTR ausente é comum. Muitos endereços residenciais, de nuvem, privados ou recém-atribuídos não publicam registros de DNS reverso. Uma resposta DNS bem-sucedida sem nomes de host não prova que o endereço não está em uso; significa apenas que a zona reversa não retornou um registro `PTR` utilizável por meio do resolvedor selecionado.

## Notas Práticas

- DNS reverso mapeia um endereço IP para um nome de host; isso é diferente de encontrar todos os domínios hospedados no mesmo endereço.
- Registros PTR são controlados pelo proprietário do endereço IP ou pelo provedor upstream, não apenas pelo proprietário do domínio.
- Sistemas de e-mail e segurança costumam comparar DNS direto e reverso, portanto um registro PTR geralmente deve apontar para um nome de host que resolva de volta para o mesmo endereço.
