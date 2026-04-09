## Overview

JSON Diff Path vergelijkt twee JSON-documenten en zet elke structurele wijziging om in een leesbaar padrecord met zowel JSONPath- als JSON Pointer-uitvoer.

## When To Use It

Gebruik dit wanneer je API-payloadwijzigingen wilt beoordelen, configuratiemigraties wilt inspecteren of RFC 6902 JSON Patch-bewerkingen wilt genereren voor automatisering.

## How It Works

De tool parseert beide JSON-invoeren, berekent `add`, `remove` en `replace`-wijzigingen en laat je daarna die bewerkingen filteren en schakelen tussen een padlijst en JSON Patch-uitvoer in hetzelfde resultatenpaneel.
