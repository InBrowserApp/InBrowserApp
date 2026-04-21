## O que é um conversor de cURL?

Um conversor de cURL transforma um comando cURL em código pronto para uso em muitas linguagens e clientes HTTP. Ele é útil quando a documentação de uma API, as ferramentas de desenvolvedor do navegador ou o histórico do terminal já fornecem uma requisição funcional e você quer levá-la para o código da aplicação sem reconstruir manualmente método, URL, cabeçalhos, cookies ou corpo.

**Crédito**
Com tecnologia [curlconverter](https://curlconverter.com) de Nick Carneiro.

## Quando esta ferramenta é útil

- Quando você parte de um exemplo cURL que já funciona na documentação da API ou no histórico do terminal.
- Quando quer comparar a mesma requisição entre `fetch`, Python `requests`, Go, Java, PHP e outros destinos antes de escolher um.
- Quando quer gerar uma base rapidamente e depois adicionar o tratamento de erros, as retentativas, a renovação de autenticação e a configuração do seu projeto.

## O que revisar após a conversão

- Confirme que o destino selecionado corresponde à biblioteca HTTP e ao runtime realmente usados no seu projeto.
- Leia os avisos com atenção. Algumas regras de aspas do shell, variáveis de ambiente ou flags de cURL não suportadas podem exigir ajustes manuais.
- Substitua tokens de exemplo, segredos ou URLs de exemplo antes de commitar o código gerado.
