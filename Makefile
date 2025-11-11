# Convenience Makefile for developers
# Uses npm scripts as the canonical commands so CI and package.json remain authoritative.

.PHONY: install test test-run serve

install:
	npm ci

test:
	npm test

test-run:
	npm test -- --run

# Serve the project using a simple HTTP server (Python 3)
# Developers can replace with `live-server` if preferred.
serve:
	python -m http.server 8000