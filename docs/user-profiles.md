# Gestion des utilisateurs avec profils (DriverProfile / CustomerProfile)

## Contexte

Auparavant, le projet utilisait une approche d’héritage :
- `Driver` étendait `User`
- `Customer` étendait `User`

Cette approche posait plusieurs problèmes :
- Complexité du schéma de base de données pour TypeORM
- Difficulté de gérer plusieurs rôles pour un même utilisateur
- Incohérences lors du chargement des données côté client
- Risques lors de l’ajout futur de champs spécifiques à chaque type

## Nouvelle approche : Profils

Nous avons adopté une approche **profilée** :
- `User` est l’entité principale pour tous les utilisateurs.
- Chaque utilisateur peut avoir un profil facultatif :
    - `DriverProfile` pour les chauffeurs
    - `CustomerProfile` pour les clients
- Les données spécifiques à un rôle sont stockées dans le profil correspondant.
- Les profils sont **chargés automatiquement** via `eager loading` pour simplifier les requêtes.

### Avantages

1. **Flexibilité**
    - Un utilisateur peut changer de rôle ou avoir plusieurs rôles sans modifier l’entité de base.
2. **Simplicité côté client**
    - Les données spécifiques sont accessibles via le profil correspondant (`user.driverProfile`, `user.customerProfile`).
3. **Clarté dans la base de données**
    - Évite des colonnes nulles inutiles pour les utilisateurs qui ne sont pas chauffeurs.
4. **Évolutivité**
    - Facile d’ajouter de nouveaux types de profils si nécessaire.

### Exemple

```ts
const user = await userRepository.findOne({
  where: { email: 'ali.baba@toto.com' },
});

if (user.driverProfile) {
  console.log('C’est un chauffeur:', user.driverProfile.driverLicenseSerial);
}

if (user.customerProfile) {
  console.log('C’est un client');
}
```
Cette architecture permet une gestion claire, sécurisée et évolutive des utilisateurs du système Cabii.
