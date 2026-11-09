# rbuild

## Automatic deployment

Pushing a commit to `main` builds the app and deploys it to Firebase Hosting. To
enable deployment, add a GitHub Actions repository secret named
`FIREBASE_SERVICE_ACCOUNT_RBUILD` containing the Firebase service account JSON
for project `rbuild`, with permission to deploy Firebase Hosting. The workflow
can also be started manually from the Actions tab.
