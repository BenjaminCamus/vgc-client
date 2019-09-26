serve:
	ng serve --open=true

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
	/root/.npm-global/bin/ng build --prod
	make start
