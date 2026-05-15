## O que é UUID v3?

UUID v3 é um formato de UUID baseado em nome. Ele recebe um UUID de namespace e
um nome, calcula o hash deles com MD5 e formata o resultado como um UUID padrão.
O comportamento importante é o determinismo: o mesmo namespace e o mesmo nome
sempre produzem o mesmo UUID.

Esta ferramenta roda inteiramente no seu navegador. O namespace, o nome e o UUID
gerado permanecem no seu dispositivo, a menos que você copie o resultado para
outro lugar.

## Quando usá-lo

- Use UUID v3 quando precisar de um identificador estável para um nome conhecido,
  como um nome DNS, URL, caminho de objeto ou nome de usuário.
- Escolha o namespace que corresponde ao tipo de nome que você está
  identificando. DNS e URL são as predefinições mais comuns.
- Reutilize o mesmo namespace de forma consistente. Alterar o namespace altera
  todos os UUIDs gerados, mesmo quando o nome permanece igual.
- Prefira UUID v5 ou outro identificador moderno quando puder escolher e precisar
  de um UUID baseado em nome com um hash mais forte. UUID v3 existe para
  compatibilidade com sistemas que esperam especificamente UUIDs baseados em MD5.

## Notas de segurança

UUID v3 não é um ID aleatório e não é secreto. Qualquer pessoa que conheça o
namespace e o nome pode regenerar o mesmo UUID. Não o use para senhas, tokens de
sessão, chaves de API ou outros valores que precisam ser imprevisíveis.
