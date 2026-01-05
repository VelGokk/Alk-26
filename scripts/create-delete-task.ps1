# Create scheduled task to delete Vercel secrets in 30 days
$triggerTime = (Get-Date).AddDays(30)
$action = New-ScheduledTaskAction -Execute 'PowerShell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Projects\Alk-26\scripts\delete-vercel-secrets.ps1"'
$trigger = New-ScheduledTaskTrigger -Once -At $triggerTime
Register-ScheduledTask -TaskName 'DeleteVercelSecrets' -Action $action -Trigger $trigger -Description 'Delete Vercel secrets from SecretStore after 30 days' -Force
Get-ScheduledTask -TaskName 'DeleteVercelSecrets' | Format-List -Property TaskName,State,NextRunTime
