## O que é Data URI?

Data URI (ou data URL) incorpora arquivos pequenos diretamente no texto. Formato: `data:[mime][;charset][;base64],data`.

**Usos comuns:**

- Imagens ou fontes inline em HTML/CSS
- Guardar pequenos assets em JSON/configs

**Notas:**

- Ideal para arquivos pequenos; strings grandes podem deixar a página lenta
- Base64 é comum para dados binários

### Exemplo

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Tudo o que vem antes da vírgula descreve o arquivo, como o tipo MIME e se ele usa Base64. Tudo o que vem depois da vírgula é a carga codificada.

### Quando este conversor é útil

- Transformar um arquivo local em uma string incorporável em HTML, CSS, JSON ou e-mail
- Criar uma demonstração autocontida sem hospedar o recurso em outro lugar
- Conferir o tipo MIME detectado antes de colar o resultado em outra ferramenta

### Limites práticos

- Data URIs funcionam melhor com arquivos pequenos, como ícones, imagens leves ou trechos curtos
- Base64 adiciona cerca de 33% de overhead, então a string final fica maior que o arquivo original
- Strings muito longas podem ser difíceis de colar em formulários, configurações ou editores com limite de tamanho
