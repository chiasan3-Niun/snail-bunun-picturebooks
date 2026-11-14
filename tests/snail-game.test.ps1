$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw -LiteralPath (Join-Path $root 'snail.html')
$js = Get-Content -Raw -LiteralPath (Join-Path $root 'snail.js')
foreach ($needle in @('snail.css','data/snail-scenes.js','snail.js','scene-image','snail-hotspots','scene-progress','scene-feedback','rank-result','reset-game','CC 姓名標示')) { if ($html -notmatch [regex]::Escape($needle)) { throw "Missing $needle" } }
if ($html -match 'N/M') { throw 'The total count format is exposed' }
foreach ($needle in @('isBookComplete','getRank','found.has','rank-result','snail.x','snail.y')) { if ($js -notmatch [regex]::Escape($needle)) { throw "Missing game behavior $needle" } }
Write-Output 'PASS snail game'
