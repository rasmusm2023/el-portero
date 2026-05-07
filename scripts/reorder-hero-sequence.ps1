param(
  [string]$SequencePath = "public\assets\videos\hero-sequence"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SequencePath)) {
  throw "Sequence path not found: $SequencePath"
}

# Desired PLAYBACK order (old indices). This will be renumbered into clip-1..clip-N.
# Keep clip-1 first, then bring the best clips early (20,21).
$orderOld = @(1, 20, 21, 2, 11, 4, 5, 15, 22, 3, 16, 9, 17, 18, 19)

function ClipFolder([int]$n) {
  return Join-Path $SequencePath ("clip-$n")
}

# Validate presence
$missing = @()
foreach ($n in $orderOld) {
  if (-not (Test-Path -LiteralPath (ClipFolder $n))) { $missing += $n }
}
if ($missing.Count -gt 0) {
  throw ("Missing clip folders: " + ($missing -join ", "))
}

# Two-phase rename to avoid collisions:
# clip-X -> _tmp-clip-X -> clip-Y
$tmpMap = @()
foreach ($n in $orderOld) {
  $from = ClipFolder $n
  $tmpName = "_tmp-clip-$n"
  Rename-Item -LiteralPath $from -NewName $tmpName
  $tmpMap += [pscustomobject]@{ Old = $n; Tmp = (Join-Path $SequencePath $tmpName) }
}

$newIndex = 1
$finalMap = @()
foreach ($row in $tmpMap) {
  $toName = "clip-$newIndex"
  Rename-Item -LiteralPath $row.Tmp -NewName $toName
  $finalMap += [pscustomobject]@{ New = $newIndex; Old = $row.Old; Path = (Join-Path $SequencePath $toName) }
  $newIndex += 1
}

Write-Host "Reordered clips:"
$finalMap | Format-Table -AutoSize

