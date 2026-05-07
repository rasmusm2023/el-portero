param(
  [Parameter(Mandatory = $true)]
  [string]$SequencePath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SequencePath)) {
  throw "Sequence path not found: $SequencePath"
}

$dirs = Get-ChildItem -LiteralPath $SequencePath -Directory |
  Where-Object { $_.Name -match '^clip-\d+$' } |
  Sort-Object { [int]($_.Name -replace 'clip-','') }

$out = foreach ($d in $dirs) {
  $p = $d.FullName
  $hasVideo = (Test-Path -LiteralPath (Join-Path $p "video.webm")) -or (Test-Path -LiteralPath (Join-Path $p "video.mp4"))
  $files = (Get-ChildItem -LiteralPath $p -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name) -join ", "
  [pscustomobject]@{
    Clip     = $d.Name
    HasVideo = $hasVideo
    Files    = $files
  }
}

$out | Format-Table -AutoSize

