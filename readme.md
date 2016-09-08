## Set up server

sudo apt-get update

# install apache

sudo apt-get install apache2

sudo apt-get install libapache2-mod-wsgi
sudo apt-get install libapache2-mod-python
sudo a2enmod wsgi python rewrite

# mysql

sudo apt-get install mysql-server php5-mysql
sudo mysql_install_db
sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt
apt-get -y install phpmyadmin
sudo apt-get install libmysqlclient-dev python-dev

# Create database mapreef
mysql -u root -p
CREATE DATABASE mapreef;

# Python and others
sudo apt-get install python-setuptools
sudo easy_install pip

# Install dependencies
sudo pip install -r requirements.txt

# Setting local conf

Copy mascref/mascref/mascref/settings_local.template to settings_local.py
Edit variables

Copy frontend/js app.env_conf.template.js to app.env_conf.js

# Setting sys.path on wsgi.py


# Apply migrations
python manage.py migrate

# Run fixtures

cd app/fixtures
./fixtures.sh

