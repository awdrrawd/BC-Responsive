# Include only distinct traditional-to-simplified pairs for PTT characters.
Add-Type -TypeDefinition 'using System; using System.Text; using System.Runtime.InteropServices; public static class ActionHanMap { [DllImport("kernel32.dll", CharSet=CharSet.Unicode)] public static extern int LCMapStringEx(string locale, uint flags, string source, int sourceLength, StringBuilder output, int capacity, IntPtr version, IntPtr reserved, IntPtr handle); public static string Convert(string source, uint flags) { var output = new StringBuilder(16); if (LCMapStringEx("zh-CN", flags, source, -1, output, output.Capacity, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero) == 0) throw new Exception("Chinese conversion failed"); return output.ToString(); } }'
$actionVariants = [ordered]@{}
$actionSource = Get-Content -LiteralPath 'TEMP/PTT_actions_1784184106842.json' -Raw -Encoding UTF8
$actionSourceChars = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
$actionCanonicalChars = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
foreach ($actionCharValue in $actionSource.ToCharArray()) {
    if ([int]$actionCharValue -lt 0x3400 -or [int]$actionCharValue -gt 0x9fff) { continue }
    $actionChar = [string]$actionCharValue
    [void]$actionSourceChars.Add($actionChar)
    [void]$actionCanonicalChars.Add([ActionHanMap]::Convert($actionChar, 0x02000000))
}
foreach ($actionCode in 0x3400..0x9fff) {
    $actionChar = [string][char]$actionCode
    $actionSimple = [ActionHanMap]::Convert($actionChar, 0x02000000)
    if ($actionChar -cne $actionSimple -and $actionCanonicalChars.Contains($actionSimple)) {
        $actionVariants[$actionChar] = $actionSimple
    }
}
$actionVariantJson = ConvertTo-Json -InputObject $actionVariants
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src/integrations/action-variants.json'), $actionVariantJson, [System.Text.UTF8Encoding]::new($false))
Write-Output "Compiled $($actionVariants.Count) distinct Chinese pairs for $($actionSourceChars.Count) PTT Han characters; identical forms pass through unchanged"

