# Deletes Vercel secrets from the SecretStore vault named VercelVault
param()

try {
    Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
    Import-Module Microsoft.PowerShell.SecretStore -ErrorAction Stop
} catch {
    Write-Error "Required SecretManagement modules not installed."
    exit 1
}

$vaultName = 'VercelVault'

if (-not (Get-SecretVault -Name $vaultName -ErrorAction SilentlyContinue)) {
    Write-Output "Vault $vaultName not found. Nothing to delete."
    exit 0
}

try {
    Remove-Secret -Name 'VERCEL_TOKEN' -Vault $vaultName -ErrorAction SilentlyContinue
    Remove-Secret -Name 'VERCEL_PROJECT_ID' -Vault $vaultName -ErrorAction SilentlyContinue
    Write-Output "Vercel secrets removed from $vaultName."
} catch {
    Write-Error "Failed to remove secrets: $_"
    exit 1
}

# Optionally unregister the vault (commented out)
# Unregister-SecretVault -Name $vaultName -ErrorAction SilentlyContinue
