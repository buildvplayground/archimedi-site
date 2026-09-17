# ArchiMedi — Site institucional (pipeline BuildV)

**Cliente:** ArchiMedi — arquitetura e obras para ambientes de saúde · Curitiba PR · desde 2015
**Assinatura:** Soluções que conectam espaço, técnica e cuidado.
**Hospedagem:** Vercel (estático, `deploy-vercel/`) + `public_html/` (Hostinger)
**Stack:** HTML estático + CSS + JS vanilla (padrão BuildV)

## Direção de design
Moderno com maturidade e credibilidade. Paleta e tipografia da marca real: azul escuro
`#0C1E2D` (predominante), terracota `#B06F54` (acento), azul claro `#547585`, off-white
`#FFFBF6`; Montserrat. Motivo: moldura quadrada de cantos abertos (do logo). Referências
institucionais: Santé Arquitetura, Onarch, Awwwards/architecture. Sem "cara de IA".
Cada seção fecha em uma tela (100svh). Sistema de movimento da casa (reveals + easing longo).

## Checklist de etapas
- [x] 1. Extrair do Drive (rclone) → `_raw/`
- [x] 2. Scaffold (Marca/ Copys/ imagens/ design-system/ Site/)
- [ ] 2b. Repo GitHub `dev-buildv/archimedi-site` (privado)
- [x] 3. Design system (`design-system/tokens.md`) da marca real
- [x] 4. Copy estruturada (`Copys/copy-estruturada.md`) do material institucional
- [x] 5. Front-end (`Site/index.html` + css/js) + auditoria
- [ ] 6. Ajustes: imagens webp (feito) + auditoria de responsividade
- [ ] 7. Módulos LGPD + tags (com IDs)
- [ ] 8. Revisão humana + deploy (gate)

## Inventário do material
- Manual de Marca (docx) → paleta, tipografia, tom de voz, logo (2 versões extraídas)
- Apresentação Institucional e de Serviços (docx) → copy, serviços, portfólio, públicos
- Portfólio 2026 (pdf), Aprofundamento (xlsx), Leads (xlsx) → em `_raw/`
- Imagens: projeto **Oncocentro** (renders reais) — Consultórios, Sala/Auditório, Rooftop
- Vídeos (.mp4) e pasta Obsoleto/: não baixados (ficam no Drive)

## Imagens tratadas → `Site/assets/img/` (webp q80)
hero, about, ambientes, band, showcase + galerias portfolio/{consultorios,sala-auditorio,rooftop}

## Pendências do usuário: ver `state.json.pendencias` / report final.
