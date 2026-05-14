## O que é um analisador de certificados X.509?

Um certificado X.509 é um documento assinado que vincula uma chave pública a uma identidade, como um domínio, serviço, organização ou pessoa. Certificados TLS, arquivos de cadeia de certificados e muitos fluxos de trabalho de S/MIME ou assinatura usam esse formato.

Este analisador lê material de certificados e chaves públicas diretamente no seu navegador. Ele pode inspecionar blocos PEM, arquivos DER binários e texto DER em base64, depois mostrar o sujeito, emissor, número de série, período de validade, algoritmo de assinatura, algoritmo da chave pública, fingerprints e extensões comuns.

Use-o quando precisar comparar um fingerprint de certificado, verificar se um certificado corresponde ao host esperado, inspecionar Subject Alternative Names, confirmar o uso da chave ou extrair detalhes da chave pública ao depurar problemas de TLS e implantação.

A ferramenta não valida cadeias de confiança nem contata autoridades certificadoras. Ela mostra o que está codificado no certificado ou na chave pública fornecida, portanto use um scanner TLS dedicado quando precisar de validação de revogação, cadeia, nome de host ou endpoint ativo.

- Compare fingerprints SHA-256 ou SHA-1 antes de instalar ou rotacionar certificados.
- Revise SAN, uso da chave, uso estendido da chave e restrições básicas sem enviar material de certificado.
- Inspecione chaves públicas SPKI independentes quando um serviço fornece apenas um arquivo PEM ou DER de chave pública.
