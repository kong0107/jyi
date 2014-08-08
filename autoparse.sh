#!/bin/bash
start=1
end=724
for(( expno=$start; expno<=$end; expno=expno+1 ))
do
	cmd="node parse.js $expno"
	$cmd
done