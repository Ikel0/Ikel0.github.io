#!/usr/bin/env python3
"""Signal: local lexical search with transparent citations."""
import argparse
import re
from collections import Counter
from pathlib import Path

def tokens(text):
    return re.findall(r"[\wÀ-ÿ'-]+", text.lower())

def main():
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    args = parser.parse_args()
    query = tokens(args.query)
    results = []
    for document in (root / "knowledge").glob("*.md"):
        text = document.read_text(encoding="utf-8")
        score = sum(Counter(tokens(text))[word] for word in query)
        sentence = next((part for part in re.split(r"(?<=[.!?])\s+", text.replace("\n", " ")) if any(word in part.lower() for word in query)), text[:180])
        results.append((score, document.name, sentence))
    print(f"Résultats pour : {args.query}\n")
    for score, source, sentence in sorted(results, reverse=True):
        if score:
            print(f"[{score:02d}] {source}\n     {sentence}\n")

if __name__ == "__main__":
    main()
