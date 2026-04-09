## Overview

JSON Diff Path compares two JSON documents and turns every structural change into a readable path record with both JSONPath and JSON Pointer output.

## When To Use It

Use it when you need to review API payload changes, inspect configuration migrations, or generate RFC 6902 JSON Patch operations for automation.

## How It Works

The tool parses both JSON inputs, computes `add`, `remove`, and `replace` changes, then lets you filter those operations and switch between a path list and JSON Patch output in the same result panel.
