# GoDaddy DNS Original Backup for socido.org

**Date Saved**: August 24, 2026

## Original Default Records (Before GitHub Pages Setup)

### 1. Original A Record
- **Record Type**: `A`
- **Name / Host**: `@`
- **Value**: `WebsiteBuilder Site`
- **TTL**: `1 Hour`

### 2. Original CNAME Record
- **Record Type**: `CNAME`
- **Name / Host**: `www`
- **Value**: `socido.org.`
- **TTL**: `1 Hour`

---

## Restoration Instructions (Safety Net)
If you ever want to point your domain back to GoDaddy's default holding page in the future:
1. Log into GoDaddy Domain Manager -> `socido.org` -> **DNS**.
2. Delete the GitHub Pages `A` records (`185.199.108.153`, etc.).
3. Edit/Set `A` record `@` to `WebsiteBuilder Site`.
4. Edit/Set `CNAME` record `www` to `socido.org.`.
