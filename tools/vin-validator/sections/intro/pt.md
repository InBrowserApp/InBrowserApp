## O que e um VIN?

Um Vehicle Identification Number (VIN) e um codigo de 17 caracteres que identifica um veiculo de forma unica.

- `1M8GDM9AXKP042788`
- As letras I, O, Q nao sao utilizadas
- O 9.o caractere e um digito verificador

### Estrutura do VIN

1. **WMI** (posicoes 1-3): World Manufacturer Identifier (Identificador Mundial do Fabricante)
2. **VDS** (posicoes 4-8): Vehicle Descriptor Section (Secao Descritiva do Veiculo)
3. **Digito verificador** (posicao 9): calculado a partir de todos os outros caracteres
4. **VIS** (posicoes 10-17): Vehicle Identifier Section (Secao de Identificacao do Veiculo)

### Digito verificador

Cada letra e transliterada para um numero (A=1, B=2, ... ignorando I, O, Q). Cada posicao tem um peso. A soma ponderada mod 11 resulta no digito verificador; 10 e representado por X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = digito verificador`

Esta ferramenta valida apenas as regras de formato e digito verificador. Nao verifica o registo real do veiculo.
