# Convenience wrappers for the repository's canonical Conda/npm commands.

.PHONY: install test test-run serve

install:
	conda run -n base npm ci

test:
	conda run -n base npm test

test-run:
	conda run -n base npm run test:run

# Serve the project using a simple HTTP server (Python 3)
# Developers can replace with `live-server` if preferred.
serve:
	python -m http.server 8000
