## O que é um número de IVA da UE?

Um número de identificação de IVA é emitido por um Estado-Membro da UE a empresas registadas para efeitos de Imposto sobre o Valor Acrescentado. Começa com um código de país de duas letras (por exemplo, `BE` para a Bélgica ou `EL` para a Grécia), seguido de uma sequência de dígitos e, por vezes, letras específica de cada país. As autoridades fiscais utilizam-no para acompanhar o comércio transfronteiriço e os pedidos de reembolso, pelo que erros em faturas, contratos ou registos de aquisições podem facilmente bloquear um pagamento ou desencadear uma auditoria.

## O que esta ferramenta realmente verifica

Este validador executa três verificações independentes, todas no seu navegador:

1. **Código de país** — as duas letras iniciais devem corresponder a um Estado-Membro da UE que participa no regime de IVA (incluindo o código especial `EL` utilizado para a Grécia).
2. **Formato** — os caracteres restantes devem corresponder ao formato de IVA documentado do país. Por exemplo, o IVA belga tem exatamente dez dígitos, o IVA austríaco começa com `U` seguido de oito dígitos, e o IVA neerlandês tem a forma `<nove dígitos>B<dois dígitos>`.
3. **Checksum** — onde existe um checksum determinístico nas regras de IVA do país (Áustria, Bélgica, Dinamarca, Finlândia, França, Alemanha, Itália, Países Baixos, Polónia, Portugal, Espanha, Suécia), o dígito ou letra final é recalculado e comparado.

Um número que passa nas três verificações está sintaticamente bem formado. Isso não é o mesmo que confirmar que a empresa está atualmente registada — para isso continua a precisar do serviço VIES da Comissão Europeia ou da autoridade fiscal local. Esta ferramenta é mais útil antes dessa verificação final, para detetar os erros de digitação, dígitos trocados e erros de copiar e colar que fazem uma consulta VIES falhar pelo motivo errado.

## Coisas comuns que deteta

- Números que parecem corretos à primeira vista mas têm o país errado (por exemplo, começando com `US` ou `UK`).
- Zeros à esquerda cortados por uma folha de cálculo, produzindo um número com um dígito a menos.
- Espaços, pontos ou traços que um sistema de faturação colou — a ferramenta normaliza-os e verifica o resultado.
- A clássica confusão entre o `GR` grego e o `EL` do IVA, que a verificação de formato rejeita imediatamente.

## O que o cartão de resultados mostra

Para além de um simples indicador válido/inválido, o resultado detalha o país, o número normalizado, o formato que o país espera e se o checksum passou, falhou ou foi ignorado porque o país não publica nenhum. Esse detalhe é útil quando é preciso explicar uma rejeição — "o formato está correto, o checksum não bate certo" é muito mais acionável do que "inválido".

## Privacidade

Todas as verificações são executadas localmente no seu navegador. Nada é enviado para um servidor, registado ou armazenado em qualquer lugar que não seja o localStorage do seu próprio navegador (para a última entrada que digitou, para que sobreviva a um recarregamento da página). Pode colar o número de IVA de um cliente sem se preocupar com o destino do mesmo.
