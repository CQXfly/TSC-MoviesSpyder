echo +---------------------------------------------+
echo |'下载node 8.10.0'                             |
echo +---------------------------------------------+
wget https://nodejs.org/dist/v8.10.0/node-v8.10.0.tar.gz
echo +---------------------------------------------+
echo |'解压node 8.10.0'                             |
echo +---------------------------------------------+
tar xvf node-v8.10.0.tar.gz
./configure
sudo make
sudo make install
sudo cp /usr/local/bin/node /usr/sbin
echo +---------------------------------------------+
echo |'更新 npm 至最新'                             |
echo +---------------------------------------------+
sudo npm install g  npm 
echo +---------------------------------------------+
echo |'试试node 吧  ctr + c 退出'                             |
echo +---------------------------------------------+
node 