# Plugin for Camunda Cockpit

This plugin allows you to convert and download any Table to CSV.

## Instalation
1. Place `csv.js` in `webapp/app/cockpit/scripts`
2. Add these lines to you cockpit configuration:
```javascript
window.camCockpitConf = {
  customScripts: {
    ngDeps: [],
    deps: ['csv'],
    paths: {
      csv: 'scripts/csv'
    }
  }
  // ...
}
```
