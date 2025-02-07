$startDate = [datetime]::ParseExact("20250101", "yyyyMMdd", $null)
$endDate = [datetime]::ParseExact("20250228", "yyyyMMdd", $null)

$csvFilePath = "C:\Users\hkhlau\Desktop\web\typescript_base\data.csv"
$url = "https://info.cld.hkjc.com/graphql/base/"

$allRows = @()

$headers = @{
    "Content-Type" = "application/json"
    "Cookie" = "ADRUM_BT=R:0|i:13753|g:4f69aa49-1c5e-40e2-9fc6-f7688b9bb36b164238|e:23|n:hkjc_0f64f199-5114-4a48-ba81-d692eac42f36"
    "Cache-Control" = "no-cache"
}

while ($startDate -le $endDate) {
    $endDateOfMonth = $startDate.AddMonths(1).AddDays(-1)

    $startDateString = $startDate.ToString("yyyyMMdd")
    $endDateString = $endDateOfMonth.ToString("yyyyMMdd")

$body = @"
{
    "operationName": "marksixResult",
    "query": "fragment lotteryDrawsFragment on LotteryDraw {\n  id\n  year\n  no\n  openDate\n  closeDate\n  drawDate\n  status\n  snowballCode\n  snowballName_en\n  snowballName_ch\n  lotteryPool {\n    sell\n    status\n    totalInvestment\n    jackpot\n    unitBet\n    estimatedPrize\n    derivedFirstPrizeDiv\n    lotteryPrizes {\n      type\n      winningUnit\n      dividend\n    }\n  }\n  drawResult {\n    drawnNo\n    xDrawnNo\n  }\n}\n\nquery marksixResult(\u0024lastNDraw: Int, \u0024startDate: String, \u0024endDate: String, \u0024drawType: LotteryDrawType) {\n  lotteryDraws(\n    lastNDraw: \u0024lastNDraw\n    startDate: \u0024startDate\n    endDate: \u0024endDate\n    drawType: \u0024drawType\n  ) {\n    ...lotteryDrawsFragment\n  }\n}",
    "variables": {
        "lastNDraw": null,
        "drawType": "All",
        "startDate": "$startDateString",
        "endDate": "$endDateString"
    }
}
"@

Write-Output $body

    $response = Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body $body
    $data = $response.Content | ConvertFrom-Json

    $rows = $data.data.lotteryDraws | ForEach-Object {
        [PSCustomObject]@{
            Id = $_.id
            DrawnNo1 = $_.drawResult.drawnNo[0]
            DrawnNo2 = $_.drawResult.drawnNo[1]
            DrawnNo3 = $_.drawResult.drawnNo[2]
            DrawnNo4 = $_.drawResult.drawnNo[3]
            DrawnNo5 = $_.drawResult.drawnNo[4]
            DrawnNo6 = $_.drawResult.drawnNo[5]
            XDrawnNo = $_.drawResult.xDrawnNo
        }
    }
    Write-Output $data.data.lotteryDraws[0].id
    $allRows += $rows

    Start-Sleep -Seconds 15
    $startDate = $startDate.AddMonths(1)
}

# 將數據寫入 CSV 文件
$allRows | Export-Csv -Path $csvFilePath -NoTypeInformation