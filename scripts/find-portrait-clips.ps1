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

$out = foreach ($c in $clips) {
  $webm = Join-Path $c.FullName "video.webm"
  $mp4 = Join-Path $c.FullName "video.mp4"
  $src = if (Test-Path -LiteralPath $webm) { $webm } elseif (Test-Path -LiteralPath $mp4) { $mp4 } else { $null }
  if (-not $src) { continue }

  $json = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of json $src | Out-String
  $data = $json | ConvertFrom-Json
  $w = [int]$data.streams[0].width
  $h = [int]$data.streams[0].height
  $ratio = if ($w -gt 0) { [math]::Round($h / $w, 3) } else { 0 }

  [pscustomobject]@{
    Clip    = $c.Name
    Width   = $w
    Height  = $h
    HOverW  = $ratio
    IsPortrait = ($h -gt $w)
    Source  = (Split-Path -Leaf $src)
  }
}

$out | Sort-Object @{ Expression = "IsPortrait"; Descending = $true }, @{ Expression = "HOverW"; Descending = $true } | Format-Table -AutoSize

