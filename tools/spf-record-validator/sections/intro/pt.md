## Como verificar um registro SPF

Cole o valor de um único registro TXT do DNS, começando com `v=spf1`, e selecione Verificar sintaxe. Se o valor aparecer no DNS dividido em várias sequências entre aspas, junte-as na ordem e mantenha os espaços que elas contêm. A ferramenta mostra cada mecanismo ou modificador e indica os erros de sintaxe ao lado do trecho a corrigir. O conteúdo colado permanece no navegador.

## Como funcionam os mecanismos e qualificadores do SPF

O SPF (Sender Policy Framework) permite que um domínio indique quais servidores podem enviar e-mails em seu nome. O servidor destinatário verifica os mecanismos na ordem. Por exemplo, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` verifica um bloco IPv4 e a política SPF de um provedor antes do `-all` final. Os qualificadores indicam sucesso (`+`), falha (`-`), falha leve (`~`) ou resultado neutro (`?`). O qualificador padrão é `+`. Modificadores como `redirect=` usam o sinal de igual e não têm qualificador.

## O que significa a contagem de consultas DNS

A RFC 7208 permite avaliar até 10 termos que geram consultas DNS. A contagem mostra quantos termos do registro colado podem gerar essas consultas. Ela inclui `a`, `mx`, `include`, `exists`, `ptr` e um `redirect` ativo. Um `include` ou `redirect` pode levar a mais termos, e um mecanismo correspondente pode encerrar a avaliação antes. Para confirmar a política SPF em uso e a contagem completa, confira o registro TXT publicado e os domínios que ele referencia.
