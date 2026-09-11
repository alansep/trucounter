#!/bin/bash
# update-guard-versions.sh
# Lê package.json e atualiza a seção "Stack Oficial" no docs/guard.md
# Uso: ./scripts/update-guard-versions.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PACKAGE_JSON="$PROJECT_ROOT/package.json"
GUARD_FILE="$PROJECT_ROOT/docs/guard.md"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "❌ package.json não encontrado em $PROJECT_ROOT"
  exit 1
fi

if [ ! -f "$GUARD_FILE" ]; then
  echo "❌ docs/guard.md não encontrado em $PROJECT_ROOT"
  exit 1
fi

# Extrair versões do package.json
ionic_version=$(node -p "require('$PACKAGE_JSON').dependencies['@ionic/angular'] || 'não encontrada'")
angular_version=$(node -p "require('$PACKAGE_JSON').dependencies['@angular/core'] || 'não encontrada'")
capacitor_core_version=$(node -p "require('$PACKAGE_JSON').dependencies['@capacitor/core'] || 'não encontrada'")
typescript_version=$(node -p "require('$PACKAGE_JSON').devDependencies['typescript'] || 'não encontrada'")
vitest_version=$(node -p "require('$PACKAGE_JSON').devDependencies['vitest'] || 'não encontrada'")
eslint_version=$(node -p "require('$PACKAGE_JSON').devDependencies['eslint'] || 'não encontrada'")
angular_cli_version=$(node -p "require('$PACKAGE_JSON').devDependencies['@angular/cli'] || 'não encontrada'")

# Data atual
current_date=$(date +%Y-%m-%d)

# Gerar nova seção Stack Oficial
new_stack="## Stack Oficial

| Tecnologia | Versão | Observação |
|------------|--------|------------|
| Ionic Angular | $ionic_version | NÃO usar componentes de versões anteriores |
| Angular | $angular_version | NgModules (standalone: false) |
| Capacitor | $capacitor_core_version | NÃO usar Cordova |
| TypeScript | $typescript_version | Strict mode habilitado |
| SCSS | — | Pré-processador de estilos |
| Vitest | $vitest_version | Framework de testes |
| ESLint | $eslint_version | Flat config |
| Node.js | >= 24.15 | Versões anteriores causam erro |
| Build | Vite (via @angular/build) | Angular CLI $angular_cli_version |"

# Atualizar data de verificação
sed -i '' "s|> \*\*Última verificação:\*\* .*|> **Última verificação:** $current_date|" "$GUARD_FILE"

# Substituir seção Stack Oficial (entre ## Stack Oficial e ## Componentes Ionic Permitidos)
# Usar awk para substituir o bloco
awk -v new_stack="$new_stack" '
/^## Stack Oficial$/ {
  print new_stack
  skip = 1
  next
}
/^## Componentes Ionic Permitidos$/ {
  skip = 0
}
!skip { print }
' "$GUARD_FILE" > "$GUARD_FILE.tmp" && mv "$GUARD_FILE.tmp" "$GUARD_FILE"

echo "✅ Stack Oficial atualizado em docs/guard.md"
echo "📅 Última verificação: $current_date"
echo ""
echo "Versões extraídas:"
echo "  Ionic Angular: $ionic_version"
echo "  Angular: $angular_version"
echo "  Capacitor: $capacitor_core_version"
echo "  TypeScript: $typescript_version"
echo "  Vitest: $vitest_version"
echo "  ESLint: $eslint_version"
