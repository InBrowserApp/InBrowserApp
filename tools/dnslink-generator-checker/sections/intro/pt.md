## Gerar um registo TXT de DNSLink para o IPFS

O DNSLink aponta um domínio ou subdomínio para um caminho de conteúdo. Introduza o seu domínio e cole um CID do IPFS ou um caminho IPFS ou IPNS. Copie o **Nome** e o **Valor TXT** gerados para um novo registo TXT no seu fornecedor de DNS. Por exemplo, para o domínio `www.example.com`, o nome do registo é `_dnslink.www.example.com`. Se o editor de DNS acrescentar automaticamente `example.com`, escreva `_dnslink.www` no campo do nome.

## Verificar para onde aponta o seu DNSLink

Selecione **Verificar registo publicado** para ver as respostas TXT da Cloudflare e da Google. Deixe o destino em branco para consultar uma configuração existente ou introduza o destino pretendido para o comparar com o valor publicado. Após uma alteração, os resolvedores podem devolver um valor anterior até que a entrada na cache expire. O TTL apresentado indica quanto tempo a resposta DNS recebida pode permanecer na cache.

## Atualizar um site IPFS num domínio personalizado

Utilize um CID do IPFS para apontar diretamente para uma versão fixa dos seus ficheiros ou um caminho IPNS para seguir um nome que pode ser atualizado. O DNSLink indica aos clientes e gateways compatíveis que conteúdo devem resolver. Para disponibilizar esse conteúdo no seu próprio domínio por HTTPS, configure um gateway compatível com DNSLink e aponte o seu domínio para esse gateway. [Domínios personalizados e DNSLink no IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
