# npm install 无效的话就这样

arr=(koa mongoose koa-router node-schedule cheerio superagent superagent-charset)

for i in "${!arr[@]}";
do
    echo "安装 ${arr[$i]} 成功"
    npm install -s ${arr[$i]} 
    npm install -s @types/${arr[$i]}
done