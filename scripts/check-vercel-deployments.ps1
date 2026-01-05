# Check Vercel deployments for the project
param()

try {
    Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
    
    # Step 1: Obtain token and project ID
    Write-Host "Retrieving credentials from vault..." -ForegroundColor Cyan
    $token = Get-Secret -Name 'VERCEL_TOKEN' -Vault VercelVault -AsPlainText -ErrorAction Stop
    $projectId = Get-Secret -Name 'VERCEL_PROJECT_ID' -Vault VercelVault -AsPlainText -ErrorAction Stop
    
    # Step 2: Prepare headers with token
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    # Step 3: Build URI in separate variable
    $baseUri = "https://api.vercel.com/v6/deployments"
    $queryParams = "?projectId=$projectId&limit=10"
    $uri = $baseUri + $queryParams
    
    Write-Host "Fetching deployments for project: $projectId" -ForegroundColor Cyan
    Write-Host "URI: $uri" -ForegroundColor Gray
    Write-Host ""
    
    # Step 4: Call Invoke-RestMethod with prepared variables
    $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get
    
    if ($response.deployments) {
        Write-Host "Latest 10 deployments:" -ForegroundColor Green
        Write-Host "======================" -ForegroundColor Green
        Write-Host ""
        
        foreach ($deployment in $response.deployments) {
            $createdAt = [DateTimeOffset]::FromUnixTimeMilliseconds($deployment.created).LocalDateTime
            $state = $deployment.state
            $url = $deployment.url
            $ready = if ($deployment.ready) { 'OK' } else { 'BUILDING' }
            
            Write-Host "[$ready] $state - $url" -ForegroundColor $(if ($state -eq 'READY') { 'Green' } elseif ($state -eq 'ERROR') { 'Red' } else { 'Yellow' })
            Write-Host "    Created: $createdAt"
            Write-Host "    ID: $($deployment.uid)"
            Write-Host ""
        }
    } else {
        Write-Host "No deployments found." -ForegroundColor Yellow
    }
    
} catch {
    Write-Error "Failed to fetch deployments: $_"
    exit 1
}
