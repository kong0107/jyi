#!/bin/bash
# Program:
#	從司法院網站下載釋字全文
start=1
end=781
for(( expno=$start; expno<=$end; expno=expno+1 ))
do
	cmd="wget --no-check-certificate https://cons.judicial.gov.tw/jcc/zh-tw/jep03/show?expno=$expno --output-document=downloads/$expno.html --tries=1"
	$cmd
	sleep 1
done
