create_db:
	mysql -h $(MYSQL_HOST) -u $(MYSQL_USER) -p$(MYSQL_PASSWORD) -e 'CREATE DATABASE $(MYSQL_DB);'
drop_db:
	mysql -h $(MYSQL_HOST) -u $(MYSQL_USER) -p$(MYSQL_PASSWORD) -e 'DROP DATABASE $(MYSQL_DB);'
migrate:
	python manage.py migrate
fixtures:
	./app/fixtures/fixtures.sh