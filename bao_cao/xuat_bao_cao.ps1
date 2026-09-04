param(
    [string]$InputHtml = (Join-Path $PSScriptRoot 'BAO_CAO_HOAN_CHINH.html'),
    [string]$OutputDocx = (Join-Path $PSScriptRoot '2354050005-LeTuanAnh-BAO-CAO-HOAN-CHINH.docx')
)

$ErrorActionPreference = 'Stop'
$word = $null
$document = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $document = $word.Documents.Open((Resolve-Path -LiteralPath $InputHtml).Path)

    foreach ($section in $document.Sections) {
        $section.PageSetup.TopMargin = $word.CentimetersToPoints(2.5)
        $section.PageSetup.BottomMargin = $word.CentimetersToPoints(2.5)
        $section.PageSetup.LeftMargin = $word.CentimetersToPoints(3.0)
        $section.PageSetup.RightMargin = $word.CentimetersToPoints(2.0)

        $footer = $section.Footers.Item(1)
        $footer.Range.ParagraphFormat.Alignment = 1
        if ($footer.PageNumbers.Count -eq 0) {
            [void]$footer.PageNumbers.Add(1, $true)
        }
    }

    $document.SaveAs2($OutputDocx, 16)
    $document.Close($false)
    $document = $null
    $word.Quit()
    $word = $null

    Write-Output "Created: $OutputDocx"
}
finally {
    if ($null -ne $document) { $document.Close($false) }
    if ($null -ne $word) { $word.Quit() }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
