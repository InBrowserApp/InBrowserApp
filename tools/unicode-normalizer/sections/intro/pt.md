## Como normalizar texto Unicode

Cole ou digite o texto no campo **Texto original** e escolha uma forma de normalização. O resultado é atualizado conforme você digita ou muda de forma. Selecione **Copiar resultado** para usar o texto normalizado em outro aplicativo. A conversão acontece no navegador e o texto permanece no seu dispositivo.

## Qual forma de normalização Unicode devo usar?

- **NFC (composição canônica)** é uma boa escolha para textos em geral. Quando existe um caractere composto, ela reúne uma letra e seu acento em um único ponto de código. Use NFC para uniformizar representações equivalentes antes de armazenar ou comparar texto.
- **NFD (decomposição canônica)** separa as sequências em seus componentes canônicos, como uma letra-base e um acento combinante. Use NFD para examinar ou manipular sinais diacríticos individualmente.
- **NFKC (composição de compatibilidade)** também uniformiza variantes de compatibilidade, como letras de largura inteira e ligaduras. É útil para buscas ou comparações em que essas diferenças não importam.
- **NFKD (decomposição de compatibilidade)** aplica os mesmos mapeamentos de compatibilidade e mantém o resultado decomposto, o que pode ajudar na análise de texto.

## Por que o texto normalizado pode parecer igual?

A letra **é** pode ser representada por `U+00E9` ou por um **e** seguido de um acento agudo combinante (`U+0065 U+0301`). NFC produz a primeira representação e NFD produz a segunda. Abra **Comparar pontos de código** para ver a sequência no início de cada texto, mesmo quando os dois parecem idênticos.

Selecione **Testar um exemplo** para ver também alterações visíveis. Com NFKC, **ＡＢＣ ① ﬁ** vira **ABC 1 fi**. NFC preserva essas diferenças de compatibilidade.

## Quando a normalização pode mudar o significado do texto?

NFKC e NFKD podem eliminar distinções de formatação, como um expoente em uma fórmula ou um número circulado em uma lista. Escolha NFC se precisar preservar essas diferenças. Alterar maiúsculas e minúsculas, remover acentos ou converter entre codificações como UTF-8 e UTF-16 são operações diferentes.

Saiba mais no [anexo do padrão Unicode sobre formas de normalização](https://www.unicode.org/reports/tr15/).
