## What is Keccak?

Keccak is a family of cryptographic hash functions that serves as the foundation for the SHA-3 (Secure Hash Algorithm 3) standard. Developed by Guido Bertoni, Joan Daemen, Michaël Peeters, and Gilles Van Assche, it won the NIST hash function competition in 2012.

**Key characteristics:**

- **Sponge construction**: Uses an innovative sponge function design with absorbing and squeezing phases
- **Variable output length**: Can produce hash outputs of any desired length
- **High security margin**: Designed with substantial security reserves
- **Different from SHA-1/SHA-2**: Based on entirely different mathematical principles
- **Keccak[c=2d] variant**: This implementation uses the original Keccak specification with capacity c = 2d (where d is the output length)

**Keccak vs SHA-3 (FIPS 202) differences:**
🔍 **Important distinction**: The original Keccak and the standardized SHA-3 are **not identical**:

- **Original Keccak**: Uses capacity c = 2d and different padding (Keccak padding: 0x01)
- **FIPS 202 SHA-3**: Uses capacity c = 2d but different padding (SHA-3 padding: 0x06)
- **Domain separation**: The padding difference ensures that Keccak and SHA-3 produce different outputs for the same input
- **This tool implements**: The **original Keccak specification** with Keccak[c=2d] parameterization

**Security status:**
✅ **Keccak is considered highly secure** with no known practical attacks. It provides excellent security margins and resistance against various cryptanalytic techniques.

**Common uses:**

- Ethereum blockchain (uses original Keccak-256)
- Academic research and cryptographic protocols
- Applications requiring variable-length hash outputs
- Systems needing alternatives to SHA-2 family
- Blockchain and cryptocurrency implementations

**Advantages over traditional hashes:**

- Fundamentally different design reduces risk of related attacks
- Flexible output length (not limited to fixed sizes)
- Strong theoretical security foundation
- Resistance to length extension attacks
- Excellent performance on various platforms

**Technical note:**

- **Keccak-256**: Produces 256-bit output (most common variant)
- **Capacity formula**: c = 2d ensures appropriate security level
- **Ethereum usage**: Ethereum specifically uses original Keccak-256, not SHA3-256
