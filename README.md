# Import Auto Algérie - Landing Page

Landing page moderne et responsive pour une agence d'importation de voitures de moins de 3 ans en Algérie.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Responsive Design** - Mobile-first approach

## 📦 Installation

1. Clonez le repository
```bash
git clone <votre-repo>
cd car-import-landing
```

2. Installez les dépendances
```bash
npm install
```

3. Lancez le serveur de développement
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🏗️ Structure du projet

```
├── app/
│   ├── globals.css          # Styles globaux et Tailwind
│   ├── layout.tsx           # Layout principal avec SEO
│   ├── page.tsx             # Page d'accueil
│   ├── robots.txt           # Configuration robots
│   └── sitemap.ts           # Sitemap pour SEO
├── components/
│   ├── Header.tsx           # Header avec navigation
│   ├── Hero.tsx             # Section hero
│   ├── Steps.tsx            # Processus en 4 étapes
│   ├── Services.tsx         # Services et avantages
│   ├── Testimonials.tsx     # Témoignages clients
│   ├── ContactForm.tsx      # Formulaire de contact
│   └── Footer.tsx           # Footer complet
├── tailwind.config.js       # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
└── next.config.js          # Configuration Next.js
```

## 🎨 Composants principaux

### Header
- Logo et navigation responsive
- Menu mobile avec hamburger
- Liens d'ancrage vers les sections
- Bouton CTA "Devis Gratuit"

### Hero
- Titre accrocheur avec mise en valeur
- Sous-titre explicatif
- Boutons CTA principaux
- Indicateurs de confiance
- Visuel placeholder pour voiture

### Steps
- Processus d'importation en 4 étapes
- Icônes et animations
- Design moderne avec connecteurs
- CTA de fin de section

### Services
- Grille de 6 services principaux
- Icônes et descriptions
- Statistiques de confiance
- Design avec hover effects

### Testimonials
- Témoignages clients authentiques
- Système de notation 5 étoiles
- Logos partenaires
- Statistiques de performance

### ContactForm
- Formulaire de contact complet
- Validation des champs
- Informations de contact
- Design responsive

### Footer
- Liens de navigation
- Informations de contact
- Réseaux sociaux
- Newsletter
- Mentions légales

## 🎯 Fonctionnalités

- ✅ Design responsive (mobile-first)
- ✅ SEO optimisé (métadonnées, sitemap, robots.txt)
- ✅ Accessibilité (WCAG)
- ✅ Performance optimisée
- ✅ TypeScript pour la robustesse
- ✅ Animations et transitions fluides
- ✅ Formulaire de contact fonctionnel
- ✅ Navigation par ancres
- ✅ Couleurs thématiques (bleu fiabilité, vert efficacité)

## 🔧 Personnalisation

### Couleurs
Les couleurs sont définies dans `tailwind.config.js` :
- **Primary** : Bleu (fiabilité, confiance)
- **Secondary** : Vert (efficacité, réussite)
- **Accent** : Gris (neutralité, professionnalisme)

### Contenu
Modifiez le contenu dans les fichiers de composants :
- Textes et titres
- Témoignages clients
- Coordonnées de contact
- Services proposés

### Styles
Personnalisez les styles dans `app/globals.css` :
- Classes utilitaires personnalisées
- Animations
- Polices

## 📱 Responsive Design

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Déployez le dossier .next
```

### Serveur traditionnel
```bash
npm run build
npm start
```

## 📈 SEO et Performance

- Métadonnées complètes (title, description, keywords)
- Open Graph et Twitter Cards
- Sitemap XML automatique
- Robots.txt configuré
- Images optimisées
- Lazy loading
- Core Web Vitals optimisés

## 🎨 Design System

### Typographie
- Font principale : Inter (Google Fonts)
- Hiérarchie claire des titres
- Lisibilité optimisée

### Espacement
- Système d'espacement cohérent
- Padding et margins standardisés
- Grilles responsives

### Couleurs
- Palette cohérente
- Contrastes respectés (WCAG)
- Modes sombre/clair supportés

## 🔒 Sécurité

- Validation des formulaires
- Protection XSS
- Headers de sécurité
- HTTPS requis

## 🌍 Internationalisation

Prêt pour l'ajout de langues supplémentaires :
- Structure i18n compatible
- Textes externalisables
- Support RTL possible

## 📞 Support

Pour toute question ou personnalisation :
- Email : contact@import-auto-algerie.com
- Téléphone : +213 555 123 456

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 