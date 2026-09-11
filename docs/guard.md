# Guard de Desenvolvimento

> **Última verificação:** 2026-09-11
> **Antes de qualquer alteração de código, leia este documento.**

## Stack Oficial

| Tecnologia | Versão | Observação |
|------------|--------|------------|
| Ionic Angular | ^9.0.0 | NÃO usar componentes de versões anteriores |
| Angular | 22.0.1 | NgModules (standalone: false) |
| Capacitor | 8.5.1 | NÃO usar Cordova |
| TypeScript | ~6.0.0 | Strict mode habilitado |
| SCSS | — | Pré-processador de estilos |
| Vitest | ^4.0.8 | Framework de testes |
| ESLint | ^9.16.0 | Flat config |
| Node.js | >= 24.15 | Versões anteriores causam erro |
| Build | Vite (via @angular/build) | Angular CLI 22 |

## Componentes Ionic Permitidos

Estes são os componentes Ionic efetivamente usados no projeto. **Use apenas estes:**

| Componente | Uso |
|------------|-----|
| `<ion-app>` | Container raiz |
| `<ion-router-outlet>` | Roteamento |
| `<ion-header>` | Cabeçalho de página |
| `<ion-toolbar>` | Barra de ferramentas |
| `<ion-title>` | Título na toolbar |
| `<ion-content>` | Conteúdo principal |

## Componentes Ionic Vedados

**NÃO use** nenhum componente, API ou padrão não listado acima. Exemplos de vedados:

- `ion-slides` (descontinuado — use Swiper)
- `ion-virtual-scroll` (descontinuado — use `@angular/cdk` ou solução nativa)
- `ion-backdrop` (uso interno do Ionic)
- `ion-gesture` (descontinuado — use Hammer.js ou Pointer Events)
- Qualquer componente de versões Ionic 4/5/6/7 não presente na lista de permitidos

**Regra geral:** Se não está na lista de permitidos, é vedado. Tratar como incompatível até confirmação manual.

## APIs Capacitor Permitidas

| API | Pacote | Uso |
|-----|--------|-----|
| Haptics | `@capacitor/haptics` | Vibração do dispositivo |
| Preferences | `@capacitor/preferences` | Armazenamento chave-valor |

**NÃO use** APIs Capacitor não listadas sem confirmação prévia. O projeto tem `@capacitor/app`, `@capacitor/keyboard`, `@capacitor/status-bar` instalados, mas não são chamados diretamente no código.

## Padrões Angular

| Regra | Motivo |
|-------|--------|
| **USE NgModules** (`standalone: false`) | Escolha de arquitetura do projeto |
| **NÃO use standalone components** | O projeto foi estruturado com NgModules e lazy loading |
| **USE lazy loading via router** | Performance e organização |
| **USE Angular signals** para estado reativo | Padrão do Angular 22 |
| **USE `IonicModule.forRoot()`** no módulo raiz | Configuração global do Ionic |
| **USE `IonicModule`** (sem `.forRoot()`) em submódulos | Módulos lazy-loaded |

## Convenções de Código

- **Prefixo de componentes:** `app-` (kebab-case)
- **Sufixo de componentes:** `Page` ou `Component`
- **Prefixo de diretivas:** `app` (camelCase)
- **Tipagem:** Nunca usar `any`, preferir `interface` sobre `type`
- **Métodos:** Máximo 20 linhas
- **Testes:** Arrange-Act-Assert, cobertura 80%+ geral, 100% paths críticos

## Exemplos — Do's and Don'ts

### ✅ CORRETO

```html
<!-- Usar apenas componentes da lista permitida -->
<ion-content class="game-content">
  <div class="score-container">
    <button (click)="scorePoint()">Ponto</button>
  </div>
</ion-content>
```

```typescript
// NgModule com lazy loading
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [GamePage],
})
export class GamePageModule {}
```

### ❌ INCORRETO

```html
<!-- NÃO usar ion-slides (descontinuado no Ionic 9) -->
<ion-slides>
  <ion-slide>...</ion-slide>
</ion-slides>

<!-- NÃO usar ion-virtual-scroll -->
<ion-virtual-scroll [items]="list">
  <ion-item *virtualItem="let item">{{ item }}</ion-item>
</ion-virtual-scroll>
```

```typescript
// NÃO usar standalone components
@Component({
  standalone: true,  // ❌ PROIBIDO neste projeto
  selector: 'app-game',
  templateUrl: './game.page.html',
})
export class GamePage {}
```

## Checklist de Confirmação

**Antes de qualquer alteração de código, confirme:**

- [ ] Li e concordo com `docs/guard.md`
- [ ] Vou usar apenas componentes da lista de permitidos
- [ vou seguir os padrões Angular (NgModule, lazy loading)
- [ ] Vou verificar versões no `package.json` se necessário

## Links de Documentação

- Ionic Angular: https://ionicframework.com/docs/angular
- Angular: https://angular.dev
- Capacitor: https://capacitorjs.com/docs
- Ionicons: https://ionic.io/ionicons

---

*Este documento é uma referência viva. Mantenha-o atualizado quando o stack mudar.*
*Para atualizar versões, rode o script: `scripts/update-guard-versions.sh`*
