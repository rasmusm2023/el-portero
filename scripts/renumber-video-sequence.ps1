param(
  [Parameter(Mandatory = $true)]
  [string]$SequencePath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SequencePath)) {
  throw "Sequence path not found: $SequencePath"
}

function Get-ClipIndex([string]$name) {
  if ($name -match '^clip-(\d+)$') { return [int]$Matches[1] }
  return $null
}

$clips = Get-ChildItem -LiteralPath $SequencePath -Directory |
  Where-Object { $_.Name -match '^clip-\d+$' } |
  Sort-Object { [int]($_.Name -replace 'clip-','') }

# Determine which clips are "valid" (have at least one video file)
$valid = @()
foreach ($c in $clips) {
  $p = $c.FullName
  $has = (Test-Path -LiteralPath (Join-Path $p "video.webm")) -or (Test-Path -LiteralPath (Join-Path $p "video.mp4"))
  if ($has) {
    $valid += $c
  } else {
    Remove-Item -LiteralPath $p -Recurse -Force
  }
}

# Renumber valid clips contiguously starting from 1
$i = 1
$renames = @()
foreach ($c in $valid) {
  $current = (Get-ClipIndex $c.Name)
  if ($current -eq $null) { continue }
  if ($current -ne $i) {
    $renames += [pscustomobject]@{
      From = $c.FullName
      ToName = "clip-$i"
    }
  }
  $i += 1
}

# Two-phase rename to avoid collisions: clip-N -> _tmp-clip-N -> clip-M
foreach ($r in $renames) {
  $tmp = Join-Path $SequencePath ("_tmp-" + (Split-Path -Leaf $r.From))
  Rename-Item -LiteralPath $r.From -NewName (Split-Path -Leaf $tmp)
  $r | Add-Member -NotePropertyName Tmp -NotePropertyValue $tmp
}

foreach ($r in $renames) {
  Rename-Item -LiteralPath $r.Tmp -NewName $r.ToName
}

Write-Host "Renumbered clips under $SequencePath"

