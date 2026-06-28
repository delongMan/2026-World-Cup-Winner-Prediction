# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue. Email [318649936@qq.com](mailto:318649936@qq.com) instead.

## Contribution Rules

All contributions must go through Pull Request review. The repository maintainer reviews every submission for:

- Malicious scripts (obfuscated code, eval injection, crypto miners)
- Backdoor or remote execution code
- Phishing or data exfiltration attempts
- Supply chain attacks (compromised dependencies)

Any PR containing malicious or harmful code will be rejected and reported.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| master  | :white_check_mark: |

## Security Best Practices

- This is a static frontend application with no server-side logic
- No user data is collected or transmitted
- All dependencies are pinned and reviewed
- Build artifacts (`dist/`) are not committed to the repository
