$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$required = @(
  'assets/images/snail-book/scene-mountain.png',
  'assets/images/snail-book/scene-garden.png',
  'assets/images/snail-book/scene-river.png',
  'data/snail-scenes.js'
)
foreach ($path in $required) {
  if (-not (Test-Path (Join-Path $root $path))) { throw "Missing $path" }
}
$data = Get-Content -Raw -LiteralPath (Join-Path $root 'data/snail-scenes.js')
if ($data -notmatch 'snailScenes') { throw 'snailScenes is missing' }
if ($data -match "id: 'house'") { throw 'Unrelated house scene is still included' }
Write-Output 'PASS snail assets'
