$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw -LiteralPath (Join-Path $root 'snail.html')
$js = Get-Content -Raw -LiteralPath (Join-Path $root 'snail.js')
foreach ($needle in @('snail.css','data/snail-scenes.js','snail.js','scene-image','snail-hotspots','scene-progress','scene-feedback','rank-result','reset-game','CC 姓名標示')) { if ($html -notmatch [regex]::Escape($needle)) { throw "Missing $needle" } }
if ($html -match 'N/M') { throw 'The total count format is exposed' }
foreach ($needle in @('isBookComplete','getRank','found.has','rank-result','snail.x','snail.y')) { if ($js -notmatch [regex]::Escape($needle)) { throw "Missing game behavior $needle" } }
if ($js -notmatch "style\.display='none'") { throw 'Image load does not hide the error overlay' }
if (-not (Test-Path (Join-Path $root 'snail-icons.css'))) { throw 'Snail found icon stylesheet is missing' }
if ($js -notmatch 'decoyPositions' -or $js -notmatch 'class="snail-hotspot decoy"') { throw 'Decoy positions are missing' }
if (-not (Test-Path (Join-Path $root 'snail-responsive.css'))) { throw 'Responsive stylesheet is missing' }
Write-Output 'PASS snail game'
