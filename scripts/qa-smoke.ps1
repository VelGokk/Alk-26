param(
  [string]$BaseUrl = $env:QA_BASE_URL
)

if (-not $BaseUrl) {
  $BaseUrl = "http://localhost:3000"
}

$BaseUrl = $BaseUrl.TrimEnd("/")

 # Use Invoke-WebRequest to stay compatible across PowerShell runtimes
 # We'll disable automatic redirection and set a timeout per request.

$routes = @(
  @{ Name = "home"; Path = "/es-ar"; Expect = @(200) },
  @{ Name = "consultoria"; Path = "/es-ar/consultoria"; Expect = @(200) },
  @{ Name = "formacion"; Path = "/es-ar/formacion"; Expect = @(200) },
  @{ Name = "recursos"; Path = "/es-ar/recursos"; Expect = @(200) },
  @{ Name = "nosotros"; Path = "/es-ar/nosotros"; Expect = @(200) },
  @{ Name = "contacto"; Path = "/es-ar/contacto"; Expect = @(200) },
  @{
    Name = "admin-redirect"
    Path = "/es-ar/admin"
    Expect = @(302, 307)
    LocationPrefix = "/es-ar/auth"
  },
  @{
    Name = "super-admin-redirect"
    Path = "/es-ar/super-admin"
    Expect = @(302, 307)
    LocationPrefix = "/es-ar/auth"
  }
)

$failed = @()

foreach ($route in $routes) {
  $uri = $BaseUrl + $route.Path
  try {
    # Try a request without following redirects so we can capture 3xx responses
    $response = Invoke-WebRequest -Uri $uri -Method Get -MaximumRedirection 0 -TimeoutSec 10 -ErrorAction Stop
    $status = if ($response.StatusCode) { [int]$response.StatusCode } else { 0 }
    $headers = $response.Headers
    $ok = $route.Expect -contains $status

    if ($ok -and $route.ContainsKey("LocationPrefix")) {
      $locationValue = $null
      if ($headers -and $headers.Keys -contains 'Location') { $locationValue = $headers['Location'] }
      if (-not $locationValue -and $headers.Location) { $locationValue = $headers.Location }

      if (-not $locationValue) {
        $ok = $false
      } else {
        if ($locationValue.StartsWith('http')) {
          $ok = $locationValue -like "*$($route.LocationPrefix)*"
        } else {
          $ok = $locationValue.StartsWith($route.LocationPrefix)
        }
      }
    }

    if ($ok) {
      Write-Host ("OK  {0} {1} -> {2}" -f $route.Name, $route.Path, $status)
    } else {
      Write-Host ("FAIL {0} {1} -> {2}" -f $route.Name, $route.Path, $status)
      $failed += $route.Name
    }
  } catch {
    # If Invoke-WebRequest throws due to a non-success status or network error,
    # try to extract a status code from the exception response (if any).
    $err = $_
    $status = 0
    $headers = $null
    if ($err.Exception -and $err.Exception.Response) {
      try {
        $resp = $err.Exception.Response
        if ($resp.StatusCode) { $status = [int]$resp.StatusCode }
        if ($resp.Headers) { $headers = $resp.Headers }
      } catch { }
    }

    if ($status -ne 0) {
      $ok = $route.Expect -contains $status
      if ($ok -and $route.ContainsKey("LocationPrefix")) {
        $locationValue = $null
        if ($headers -and $headers.Keys -contains 'Location') { $locationValue = $headers['Location'] }
        if (-not $locationValue -and $headers.Location) { $locationValue = $headers.Location }
        if (-not $locationValue) { $ok = $false } else {
          if ($locationValue.StartsWith('http')) { $ok = $locationValue -like "*$($route.LocationPrefix)*" } else { $ok = $locationValue.StartsWith($route.LocationPrefix) }
        }
      }

      if ($ok) {
        Write-Host ("OK  {0} {1} -> {2}" -f $route.Name, $route.Path, $status)
      } else {
        Write-Host ("FAIL {0} {1} -> {2}" -f $route.Name, $route.Path, $status)
        $failed += $route.Name
      }
    } else {
      Write-Host ("FAIL {0} {1} -> error {2}" -f $route.Name, $route.Path, $err.Exception.Message)
      $failed += $route.Name
    }
  }
}

if ($failed.Count -gt 0) {
  Write-Host ("Smoke check failed: {0}" -f ($failed -join ", "))
  exit 1
}

Write-Host "Smoke check passed."
exit 0
