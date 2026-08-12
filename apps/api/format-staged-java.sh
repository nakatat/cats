#!/usr/bin/env sh

set -eu

repository_root=$(git rev-parse --show-toplevel)
cd "$repository_root"

staged_java_files=$(git diff --cached --name-only --diff-filter=ACMR | sed -n '/^apps\/api\/src\/.*\.java$/p')

if [ -z "$staged_java_files" ]; then
  exit 0
fi

mvn -q -f apps/api/pom.xml spotless:apply

printf '%s\n' "$staged_java_files" | while IFS= read -r file; do
  git add -- "$file"
done

# Spotless applies the configured formatter to the whole API project. Restore
# unrelated files from the index so only the originally staged Java files move.
git restore --worktree -- .
