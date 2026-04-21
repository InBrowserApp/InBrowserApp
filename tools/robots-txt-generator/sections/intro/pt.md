## O que é um gerador de robots.txt?

Um gerador de robots.txt ajuda a combinar regras de user-agent, caminhos allow/disallow e links de sitemap para criar o arquivo robots.txt. Publique-o na raiz do site como /robots.txt para que os crawlers possam lê-lo.

### O que este gerador ajuda você a fazer

- Criar regras separadas para mecanismos de busca, rastreadores de IA ou bots personalizados
- Adicionar `Allow`, `Disallow`, sitemap e diretivas avançadas opcionais em um só lugar
- Copiar ou baixar um arquivo `robots.txt` pronto para publicar

### Exemplo

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Este exemplo pede aos rastreadores que evitem a maior parte de `/admin/`, mantém `/admin/help/` rastreável e aponta para o sitemap.

### Observações importantes

- Publique o arquivo em `/robots.txt` na raiz do seu site
- `robots.txt` é público e apenas orientativo, não controle de acesso
- Nem todos os rastreadores oferecem suporte a `Host` e `Crawl-delay`
