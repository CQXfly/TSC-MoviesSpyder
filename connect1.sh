echo "请输入 服务器用户名称 默认 root"
read serverName
echo "请输入服务器地址"
read addr
if [[$addr =~ "^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$"]]
then 
    echo "haha"
else 
    echo "不合法"
fi
echo "即将执行 scp ./installNode.sh $serverName@$addr"

scp ./connect.sh $serverName@$addr ./test