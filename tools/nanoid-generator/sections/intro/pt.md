## O que é NanoID?

NanoID é um gerador compacto de IDs únicos, seguro para URL, criado para aplicações web modernas, APIs e ferramentas internas. O formato padrão usa 21 caracteres de um alfabeto com 64 caracteres, o que fornece cerca de 126 bits de aleatoriedade e ainda assim permanece curto o suficiente para URLs, nomes de ficheiros e dados de teste.

Tudo nesta ferramenta é executado localmente no seu navegador. O seu alfabeto personalizado e os IDs gerados não saem da página, o que a torna prática para prototipagem rápida, geração de fixtures e tarefas operacionais pontuais.

**Pontos principais:**

- **Seguro para URL**: usa A-Z, a-z, 0-9, - e \_.
- **Personalizável**: ajuste o comprimento e o alfabeto às suas restrições.
- **Aleatoriedade segura**: usa valores aleatórios criptográficos no navegador.
- **Exportação em texto simples**: copie ou transfira o lote atual quando precisar de dados-semente, conteúdo de demonstração ou listas prontas para importar.

**Orientações práticas:**

- Mantenha o comprimento padrão de 21 caracteres quando quiser um identificador genérico forte com uma probabilidade muito baixa de colisão.
- IDs mais curtos servem para tokens temporários de UI ou dados mock locais, mas o risco de colisão aumenta à medida que reduz o comprimento ou gera lotes maiores.
- Um alfabeto maior fornece mais entropia por caractere, por isso muitas vezes é possível manter IDs mais curtos sem perder tanta unicidade.
- Alfabetos personalizados devem conter apenas caracteres únicos. Duplicados distorcem a distribuição, por isso esta ferramenta bloqueia-os antes de gerar o resultado.
