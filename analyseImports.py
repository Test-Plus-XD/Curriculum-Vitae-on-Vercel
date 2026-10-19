#!/usr/bin/env python3
### Import graph analyser for a Next.js (App Router) repository.
### Flow: collect source files -> parse import specifiers -> resolve each to a repo file
### -> build a directed graph -> compute per-entry-point direct and transitive dependencies.

import json
import os
import re
import sys

# Regex capturing static imports, re-exports and dynamic import() calls.
IMPORT_PATTERN = re.compile(
    r"""(?:import\s+(?:[^'"]*?\s+from\s+)?|export\s+[^'"]*?\s+from\s+|import\()\s*['"]([^'"]+)['"]""",
    re.MULTILINE,
)
EXTENSIONS = (".tsx", ".ts", ".css", ".json")

# Collects every source file under srcRoot, returning paths relative to the repo root.
def collectFiles(repoRoot, srcRoot):
    collected = []
    for directory, _, fileNames in os.walk(os.path.join(repoRoot, srcRoot)):
        for fileName in fileNames:
            if fileName.endswith(EXTENSIONS):
                collected.append(os.path.relpath(os.path.join(directory, fileName), repoRoot))
    return sorted(collected)

# Resolves one import specifier to a repo-relative file path, or None for external packages.
# Handles the "@/" alias (mapped to src/) and relative paths, trying extensions and index files.
def resolveSpecifier(specifier, importerPath, knownFiles):
    if specifier.startswith("@/"): basePath = os.path.join("src", specifier[2:])
    elif specifier.startswith("."): basePath = os.path.normpath(os.path.join(os.path.dirname(importerPath), specifier))
    else: return None
    candidates = [basePath] + [basePath + ext for ext in EXTENSIONS] + [os.path.join(basePath, "index" + ext) for ext in EXTENSIONS]
    for candidate in candidates:
        if candidate in knownFiles: return candidate
    return None

# Builds the full graph: file -> list of internal files it imports, plus external packages per file.
def buildGraph(repoRoot, files):
    knownFiles = set(files)
    internalEdges, externalPackages = {}, {}
    for filePath in files:
        if not filePath.endswith((".ts", ".tsx")): continue
        with open(os.path.join(repoRoot, filePath), encoding="utf-8") as handle: source = handle.read()
        internalEdges[filePath], externalPackages[filePath] = [], []
        for specifier in IMPORT_PATTERN.findall(source):
            resolved = resolveSpecifier(specifier, filePath, knownFiles)
            if resolved and resolved not in internalEdges[filePath]: internalEdges[filePath].append(resolved)
            elif not resolved and not specifier.startswith((".", "@/")): externalPackages[filePath].append(specifier)
    return internalEdges, externalPackages

# Computes every file reachable from a starting file (depth-first), excluding the start itself.
def reachableFrom(startPath, internalEdges):
    seen, stack = set(), [startPath]
    while stack:
        current = stack.pop()
        for neighbour in internalEdges.get(current, []):
            if neighbour not in seen:
                seen.add(neighbour)
                stack.append(neighbour)
    return seen

if __name__ == "__main__":
    repoRoot = sys.argv[1] if len(sys.argv) > 1 else "."
    files = collectFiles(repoRoot, "src")
    internalEdges, externalPackages = buildGraph(repoRoot, files)
    entryPoints = [f for f in files if re.search(r"src/app/.*(page|layout|not-found)\.tsx$", f) or f in ("src/app/robots.ts", "src/app/sitemap.ts", "src/proxy.ts")]
    report = {"entryPoints": {}, "edges": internalEdges, "external": {k: sorted(set(v)) for k, v in externalPackages.items()}}
    for entry in entryPoints:
        report["entryPoints"][entry] = {"direct": internalEdges.get(entry, []), "transitive": sorted(reachableFrom(entry, internalEdges))}
    print(json.dumps(report, indent=1))
