param(
  [string]$Folder = "public\videos-live"
)

$ErrorActionPreference = "Stop"

$resolved = (Resolve-Path -LiteralPath $Folder).Path
$sh = New-Object -ComObject Shell.Application
$dir = $sh.NameSpace($resolved)

if (-not $dir) {
  throw "Could not open folder in Shell.Application: $resolved"
}

$items = @($dir.Items())
if ($items.Count -eq 0) {
  Write-Host "No items found in $resolved"
  exit 0
}

function Get-PropValue([__ComObject]$directory, [__ComObject]$item, [string]$propName) {
  for ($i = 0; $i -le 350; $i++) {
    $k = $directory.GetDetailsOf($null, $i)
    if ($k -eq $propName) {
      return $directory.GetDetailsOf($item, $i)
    }
  }
  return $null
}

$items |
  ForEach-Object {
    $item = $_
    [pscustomobject]@{
      Name         = $item.Name
      Duration     = (Get-PropValue $dir $item "Length")
      FrameWidth   = (Get-PropValue $dir $item "Frame width")
      FrameHeight  = (Get-PropValue $dir $item "Frame height")
      Dimensions   = (Get-PropValue $dir $item "Dimensions")
      Title        = (Get-PropValue $dir $item "Title")
      MediaCreated = (Get-PropValue $dir $item "Media created")
    }
  } |
  Sort-Object Name |
  Format-Table -AutoSize

