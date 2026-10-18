$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $baseDir) { $baseDir = Get-Location }

Write-Host "Building standalone Athq Incubator Platform single file bundle..." -ForegroundColor Cyan

$htmlPath = Join-Path $baseDir "public\index.html"
$cssPath = Join-Path $baseDir "public\css\style.css"
$landingJsPath = Join-Path $baseDir "public\js\landing.js"

if (-not (Test-Path $htmlPath)) {
    Write-Error "public\index.html not found at $htmlPath"
    exit 1
}

$rawHtml = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
$rawCss = if (Test-Path $cssPath) { [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8) } else { "" }
$rawJs = if (Test-Path $landingJsPath) { [System.IO.File]::ReadAllText($landingJsPath, [System.Text.Encoding]::UTF8) } else { "" }

$out = $rawHtml

# Convert and inline image assets to Base64 Data URIs
$athqPng = Join-Path $baseDir "public\assets\images\athq-logo.png"
if (Test-Path $athqPng) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($athqPng))
    $uri = "data:image/png;base64,$b64"
    $out = $out.Replace('src="assets/images/athq-logo.png"', "src=`"$uri`"")
    $out = $out.Replace('href="assets/images/athq-logo.svg"', "href=`"$uri`"")
    Write-Host "Inlined athq-logo.png ($([math]::Round($b64.Length/1024, 1)) KB)" -ForegroundColor Green
}

$birPng = Join-Path $baseDir "public\assets\images\bir-logo.png"
if (Test-Path $birPng) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($birPng))
    $uri = "data:image/png;base64,$b64"
    $out = $out.Replace('src="assets/images/bir-logo.png"', "src=`"$uri`"")
    Write-Host "Inlined bir-logo.png ($([math]::Round($b64.Length/1024, 1)) KB)" -ForegroundColor Green
}

$athqSvg = Join-Path $baseDir "public\assets\images\athq-logo.svg"
if (Test-Path $athqSvg) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($athqSvg))
    $uri = "data:image/svg+xml;base64,$b64"
    $out = $out.Replace('src="assets/images/athq-logo.svg"', "src=`"$uri`"")
    $out = $out.Replace('href="assets/images/athq-logo.svg"', "href=`"$uri`"")
}

$birSvg = Join-Path $baseDir "public\assets\images\bir-logo.svg"
if (Test-Path $birSvg) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($birSvg))
    $uri = "data:image/svg+xml;base64,$b64"
    $out = $out.Replace('src="assets/images/bir-logo.svg"', "src=`"$uri`"")
}

$partnersSvg = Join-Path $baseDir "public\assets\images\partners.svg"
if (Test-Path $partnersSvg) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($partnersSvg))
    $uri = "data:image/svg+xml;base64,$b64"
    $out = $out.Replace('src="assets/images/partners.svg"', "src=`"$uri`"")
}

# Inline CSS
$cssBlock = "<style>`r`n" + $rawCss + "`r`n</style>"
$out = $out.Replace('<link rel="stylesheet" href="css/style.css">', $cssBlock)

# Inline JS
$jsBlock = "<script>`r`n" + $rawJs + "`r`n</script>`r`n</body>"
$regex = New-Object System.Text.RegularExpressions.Regex('(?s)<script\s+src=["'']js/landing\.js["'']>\s*</script>\s*</body>')
if ($regex.IsMatch($out)) {
    $out = $regex.Replace($out, $jsBlock)
} else {
    $out = $out.Replace('<script src="js/landing.js"></script>', "<script>`r`n" + $rawJs + "`r`n</script>")
}

# Write Standalone Bundle
$target = Join-Path $baseDir "Athq-Incubator-Platform.html"
[System.IO.File]::WriteAllText($target, $out, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Standalone bundle successfully generated!" -ForegroundColor Green
Write-Host "Target: $target" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round(((Get-Item $target).Length / 1MB), 2)) MB" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
