

sudo apt-get install libmysqlclient-dev python-dev

mysql -u root -p

CREATE DATABASE mascref;

python manage.py loaddata user.json
python manage.py loaddata researcher.json
python manage.py loaddata group_set.json
python manage.py loaddata transect_type.json
python manage.py loaddata group_category.json
python manage.py loaddata group.json
python manage.py loaddata country.json
python manage.py loaddata initial_data.json

python manage.py runserver 53190


