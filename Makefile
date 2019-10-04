serve:
	ng serve --host 0.0.0.0 --disable-host-check

start: stop
	docker-compose -f docker-compose.yml up -d

watch:
	docker-compose -f docker-compose.yml up

stop:
	docker-compose -f docker-compose.yml stop

bash:
	docker exec -it vgc-client_nginx bash

update:
	git pull
	npm install
	ng build --prod
	make start
