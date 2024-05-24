
$folder = Get-Location # The root you want to monitor
                      
$fsw = New-Object IO.FileSystemWatcher $folder, $filter -Property @{IncludeSubdirectories = $false;NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite'}

Register-ObjectEvent $fsw Created -SourceIdentifier FileCreated -Action {
$name = $Event.SourceEventArgs.Name
$changeType = $Event.SourceEventArgs.ChangeType
$timeStamp = $Event.TimeGenerated
Write-Host "The file '$name' was $changeType at $timeStamp" -fore green
Out-File -FilePath c:\scripts\filechange\outlog.txt -Append -InputObject "The file '$name' was $changeType at $timeStamp"}

Register-ObjectEvent $fsw Deleted -SourceIdentifier FileDeleted -Action {
$name = $Event.SourceEventArgs.Name
$changeType = $Event.SourceEventArgs.ChangeType
$timeStamp = $Event.TimeGenerated
Write-Host "The file '$name' was $changeType at $timeStamp" -fore red
Out-File -FilePath c:\scripts\filechange\outlog.txt -Append -InputObject "The file '$name' was $changeType at $timeStamp"}

Register-ObjectEvent $fsw Changed -SourceIdentifier FileChanged -Action {
$name = $Event.SourceEventArgs.Name
$changeType = $Event.SourceEventArgs.ChangeType
$timeStamp = $Event.TimeGenerated
Write-Host "The file '$name' was $changeType at $timeStamp" -fore white
Out-File -FilePath c:\scripts\filechange\outlog.txt -Append -InputObject "The file '$name' was $changeType at $timeStamp"}

