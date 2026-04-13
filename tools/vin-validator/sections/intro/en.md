## What is a VIN?

A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.

- `1M8GDM9AXKP042788`
- Letters I, O, Q are not used
- The 9th character is a check digit

### VIN structure

1. **WMI** (positions 1-3): World Manufacturer Identifier
2. **VDS** (positions 4-8): Vehicle Descriptor Section
3. **Check digit** (position 9): computed from all other characters
4. **VIS** (positions 10-17): Vehicle Identifier Section

### Check digit

Each letter is transliterated to a number (A=1, B=2, ... skipping I, O, Q). Each position has a weight. The weighted sum mod 11 gives the check digit; 10 is represented by X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = check digit`

This tool validates format and check digit rules only. It does not verify real-world registration.
