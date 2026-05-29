# API Test Script for CodeFit Backend
# Run: powershell -File test-api.ps1

$baseUrl = "http://localhost:5000"
$results = @()

function Test-Api {
    param([string]$name, [string]$method, [string]$endpoint, [hashtable]$body, [string]$token, [int]$expectedStatus = 200)
    $url = "$baseUrl$endpoint"
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }

    try {
        $params = @{ Uri = $url; Method = $method; ContentType = "application/json" }
        if ($body) { $params["Body"] = ($body | ConvertTo-Json -Compress) }
        if ($token) { $params["Headers"] = $headers }

        $resp = Invoke-WebRequest @params -UseBasicParsing
        $status = [int]$resp.StatusCode
        $success = $status -eq $expectedStatus
        $color = if ($success) { "Green" } else { "Red" }
        Write-Host "$($method.PadRight(8)) $endpoint" -ForegroundColor $color
        Write-Host "         Status: $status" -ForegroundColor $color
        $results += @{ name = $name; status = $status; success = $success }
    } catch {
        $errMsg = $_.Exception.Message -replace "The remote server returned an error: \(|\).*", ""
        Write-Host "$($method.PadRight(8)) $endpoint" -ForegroundColor Red
        Write-Host "         ERROR: $errMsg" -ForegroundColor Red
        $results += @{ name = $name; status = 0; success = $false; error = $errMsg }
    }
}

Write-Host "`n=== GETTING TOKEN ===" -ForegroundColor Cyan
$loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@codefit.com","password":"admin123"}' -UseBasicParsing
$loginJson = $loginResp.Content | ConvertFrom-Json
$token = $loginJson.data.token
$userId = $loginJson.data.user.id
Write-Host "Token obtained: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Green

Write-Host "`n=== TESTING PUBLIC ENDPOINTS ===" -ForegroundColor Cyan
Test-Api "Health" "GET" "/api/health"
Test-Api "Get All Courses" "GET" "/api/courses"
Test-Api "Get Course by ID" "GET" "/api/courses/1" -expectedStatus 400
Test-Api "Get Active Hackathons" "GET" "/api/hackathons/active"
Test-Api "Get Upcoming Hackathons" "GET" "/api/hackathons/upcoming"
Test-Api "Get Ended Hackathons" "GET" "/api/hackathons/ended"
Test-Api "Get Stats" "GET" "/api/stats/leaderboard"

Write-Host "`n=== TESTING AUTHENTICATED ENDPOINTS ===" -ForegroundColor Cyan
Test-Api "Get Me" "GET" "/api/auth/me" -token $token
Test-Api "Get Profile" "GET" "/api/user/profile" -token $token
Test-Api "Get My Enrollments" "GET" "/api/enrollments/my" -token $token
Test-Api "Get My Payments" "GET" "/api/payment/my" -token $token
Test-Api "Get My Minitest Results" "GET" "/api/minitests/my/results" -token $token
Test-Api "Get Notifications" "GET" "/api/notifications" -token $token
Test-Api "Get Leaderboard" "GET" "/api/leaderboard" -token $token

Write-Host "`n=== TESTING COURSE WITH REAL ID ===" -ForegroundColor Cyan
$coursesResp = Invoke-WebRequest -Uri "$baseUrl/api/courses" -UseBasicParsing
$coursesJson = $coursesResp.Content | ConvertFrom-Json
if ($coursesJson.data -and $coursesJson.data.Count -gt 0) {
    $firstCourseId = $coursesJson.data[0].id
    Write-Host "First course ID: $firstCourseId" -ForegroundColor Yellow
    Test-Api "Get Course By Real ID" "GET" "/api/courses/$firstCourseId"
    Test-Api "Get Course Phases" "GET" "/api/phases/course/$firstCourseId"
    Test-Api "Get Course Enrollments" "GET" "/api/enrollments/$firstCourseId" -token $token
    Test-Api "Get Course Minitests" "GET" "/api/minitests/course/$firstCourseId"
} else {
    Write-Host "No courses found in response" -ForegroundColor Yellow
}

Write-Host "`n=== TESTING ADDITIONAL ROUTES ===" -ForegroundColor Cyan
Test-Api "Get User Profile" "GET" "/api/users/profile" -token $token
Test-Api "Get Global Leaderboard" "GET" "/api/stats/global-leaderboard"
Test-Api "Get My Stats" "GET" "/api/stats/me" -token $token
Test-Api "Get Platform Stats" "GET" "/api/stats/platform"
Test-Api "Get Course Stats" "GET" "/api/stats/course/$firstCourseId" -expectedStatus 200
Test-Api "Get All Problems" "GET" "/api/problems"
Test-Api "Get Certificate" "GET" "/api/certificates" -token $token
Test-Api "Get Leaderboard" "GET" "/api/leaderboard" -token $token

Write-Host "`n=== TESTING HACKATHON WITH REAL ID ===" -ForegroundColor Cyan
$hackResp = Invoke-WebRequest -Uri "$baseUrl/api/hackathons/active" -UseBasicParsing
$hackJson = $hackResp.Content | ConvertFrom-Json
if ($hackJson.data -and $hackJson.data.Length -gt 0) {
    $firstHackId = $hackJson.data[0].id
    Write-Host "First hackathon ID: $firstHackId" -ForegroundColor Yellow
    Test-Api "Get Hackathon By ID" "GET" "/api/hackathons/$firstHackId"
    Test-Api "Get Hackathon Leaderboard" "GET" "/api/hackathons/$firstHackId/leaderboard"
    Test-Api "Get Hackathon Participants" "GET" "/api/hackathons/$firstHackId/participants"
    Test-Api "Get My Registered Hackathons" "GET" "/api/hackathons/registered" -token $token
} else {
    Write-Host "No active hackathons found" -ForegroundColor Yellow
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_.success }).Count
$failed = ($results | Where-Object { -not $_.success }).Count
$total = $results.Count
Write-Host "Total: $total | Passed: $passed | Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
if ($failed -gt 0) {
    Write-Host "`nFailed endpoints:" -ForegroundColor Red
    $results | Where-Object { -not $_.success } | ForEach-Object {
        Write-Host "  - $($_.name): $(if ($_.error) { $_.error } else { $_.status })" -ForegroundColor Red
    }
}
