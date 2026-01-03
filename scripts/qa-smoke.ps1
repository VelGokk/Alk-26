param(
  [string]$BaseUrl = $env:QA_BASE_URL
)

if (-not $BaseUrl) {
  $BaseUrl = "http://localhost:3000"
}

$BaseUrl = $BaseUrl.TrimEnd("/")

$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $false
$client = New-Object System.Net.Http.HttpClient($handler)
$client.Timeout = [TimeSpan]::FromSeconds(10)

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
    $response = $client.GetAsync($uri, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
    $status = [int]$response.StatusCode
    $ok = $route.Expect -contains $status

    if ($ok -and $route.ContainsKey("LocationPrefix")) {
      $location = $response.Headers.Location
      if (-not $location) {
        $ok = $false
      } else {
        $locationValue = $location.ToString()
        if ($locationValue.StartsWith("http")) {
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
    Write-Host ("FAIL {0} {1} -> error {2}" -f $route.Name, $route.Path, $_.Exception.Message)
    $failed += $route.Name
  }
}

if ($failed.Count -gt 0) {
  Write-Host ("Smoke check failed: {0}" -f ($failed -join ", "))
  exit 1
}

Write-Host "Smoke check passed."
exit 0
