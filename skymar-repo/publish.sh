#!/bin/bash
# Publish skymar.studio.  Usage:  ./publish.sh "commit message"
# Lives outside the git repo on purpose so it never lands in the public repo.
set -e

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/Untitled"
cd "$REPO"

# A tool that cannot delete files may have left this behind. Harmless to remove.
rm -f .git/index.lock

echo "Fetching GitHub..."
git fetch origin

# Move HEAD to whatever is on GitHub WITHOUT touching your files, so the commit
# below contains only your actual changes and pushes as a clean fast-forward.
git reset --soft origin/main

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to publish. Your files already match GitHub."
  exit 0
fi

echo
echo "About to publish:"
git status --short
echo
read -r -p "Continue? [y/N] " ok
[ "$ok" = "y" ] || [ "$ok" = "Y" ] || { echo "Cancelled."; exit 1; }

git add -A
git commit -m "${1:-Update site}"
git push

echo
echo "Pushed. GitHub Pages rebuilds in 1-2 minutes."
echo "Then clear the old link previews:"
echo "  https://www.linkedin.com/post-inspector/"
echo "  https://developers.facebook.com/tools/debug/"
