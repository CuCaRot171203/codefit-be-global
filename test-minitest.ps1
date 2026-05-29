$r = Invoke-WebRequest -Uri 'http://localhost:5000/api/minitests/course/0b72b408-015b-4267-b9ce-137782deaa32' -UseBasicParsing
Write-Host "Status: $($r.StatusCode)"
$j = $r.Content | ConvertFrom-Json
Write-Host "Success: $($j.success)"
Write-Host "Data count: $($j.data.Count)"
