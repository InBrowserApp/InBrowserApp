## O que é um User-Agent?

Uma string User-Agent (UA) identifica o navegador ou app que faz uma requisição e geralmente inclui navegador, SO, dispositivo e motor. Como pode ser falsificada, trate-a como uma dica e não como um sinal de segurança.

### O que este analisador mostra

Esta ferramenta analisa localmente no seu navegador a cadeia UA colada e organiza o resultado em navegador, sistema operativo, motor, dispositivo, CPU e saída JSON. Nada é enviado.

### Exemplo

Cole uma cadeia comum do Chrome no Windows como esta:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

O resultado deverá identificar o Chrome 115 no Windows 10, com motor Blink e arquitetura de CPU amd64.

### Nota importante

Os navegadores modernos dependem cada vez mais de Client Hints, por isso uma cadeia UA copiada pode não mostrar tudo o que um site vê durante um pedido real.
