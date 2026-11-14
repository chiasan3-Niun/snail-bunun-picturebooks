$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$required = @(
  'assets/images/snail-book/scene-page5-mountain.jpg',
  'assets/images/snail-book/scene-page6-garden.jpg',
  'assets/images/snail-book/scene-page7-leaves.png',
  'assets/images/snail-book/scene-page8-river.jpg',
  'assets/images/snail-book/scene-page9-river.jpg',
  'assets/images/snail-book/scene-page10-ricefield.jpg',
  'data/snail-scenes.js'
)
foreach ($path in $required) {
  if (-not (Test-Path (Join-Path $root $path))) { throw "Missing $path" }
}
$data = Get-Content -Raw -LiteralPath (Join-Path $root 'data/snail-scenes.js')
if ($data -notmatch 'snailScenes') { throw 'snailScenes is missing' }
if ($data -match "id: 'house'") { throw 'Unrelated house scene is still included' }
Write-Output 'PASS snail assets'
