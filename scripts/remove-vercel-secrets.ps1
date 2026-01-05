Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction SilentlyContinue
Import-Module Microsoft.PowerShell.SecretStore -ErrorAction SilentlyContinue

# Remove stored Vercel secrets
Try {
    Remove-Secret -Vault 'VercelVault' -Name 'VERCEL_TOKEN' -ErrorAction SilentlyContinue
    Remove-Secret -Vault 'VercelVault' -Name 'VERCEL_PROJECT_ID' -ErrorAction SilentlyContinue
} Catch {
    # ignore
}

# Unregister scheduled task (self-cleanup)
Try {
    Unregister-ScheduledTask -TaskName 'RemoveVercelSecrets' -Confirm:$false -ErrorAction SilentlyContinue
} Catch {
    # ignore
}
