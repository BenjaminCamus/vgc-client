install:
	npm install

serve:
	ng serve --open=true

build:
	ng build
	#add docker nginx



start: stop
	docker-compose -f docker-compose.yml up -d

watch:
	docker-compose -f docker-compose.yml up

stop:
	docker-compose -f docker-compose.yml stop

bash:
	docker exec -it vgc-client_nginx bash
