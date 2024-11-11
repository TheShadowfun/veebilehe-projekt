## GitHub Copilot Chat

- Extension Version: 0.22.2 (prod)
- VS Code: vscode/1.95.2
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.6 (24 ms)
- DNS ipv6 Lookup: ::ffff:140.82.121.6 (21 ms)
- Electron Fetcher (configured): HTTP 403 (145 ms)
- Node Fetcher: HTTP 403 (174 ms)
- Helix Fetcher: HTTP 403 (247 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.21 (51 ms)
- DNS ipv6 Lookup: ::ffff:140.82.114.21 (9 ms)
- Electron Fetcher (configured): HTTP 200 (365 ms)
- Node Fetcher: HTTP 200 (379 ms)
- Helix Fetcher: HTTP 200 (378 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).