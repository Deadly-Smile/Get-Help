build:
	docker build -t deadlysmile/get-help-backend:v0.1 Back-End

run:
	docker run --rm -p 8000:80 deadlysmile/get-help-backend:v0.1

run-frontend:
	cd Front-End && npm run dev

run-backend:
	cd Back-End && php artisan serve --host=127.0.0.1 --port=8000

migrate:
	cd Back-End && php artisan migrate:fresh --seed