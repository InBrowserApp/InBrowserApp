## Por que esta ferramenta é útil

A maioria dos sites não precisa de um sistema enorme de sitemap. Motores de busca precisam de um documento XML válido com URLs estáveis, sinais de atualização sensatos e sem erros acidentais de formatação. Esta ferramenta foca nesse trabalho central.

## O que ela cobre

- Criar um sitemap `urlset` padrão para páginas de um site.
- Criar um documento `sitemapindex` quando você já divide sites grandes em vários arquivos sitemap.
- Trabalhar com URLs absolutas ou caminhos relativos limpos unidos a uma URL base.

## O que observar

- Os locais do sitemap devem resolver para URLs canônicas finais, não para redirecionamentos temporários.
- `lastmod`, `changefreq` e `priority` são dicas, não garantias de comportamento de rastreamento.
- Se cada linha já for uma URL completa, desative a união automática com a URL base para manter o XML explícito.
