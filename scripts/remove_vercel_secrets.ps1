# Remove Vercel secrets from SecretStore
Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction SilentlyContinue
Import-Module Microsoft.PowerShell.SecretStore -ErrorAction SilentlyContinue

try {
    if (Get-SecretVault -Name VercelVault -ErrorAction SilentlyContinue) {
        Remove-Secret -Name VERCEL_TOKEN -Vault VercelVault -ErrorAction SilentlyContinue
        Remove-Secret -Name VERCEL_PROJECT_ID -Vault VercelVault -ErrorAction SilentlyContinue
    }
} catch {
    # ignore errors
}
