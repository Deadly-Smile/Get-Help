# Get-Help
The deadline is 8 August 2023, so hurry up.

## Used commands for back-end
- php artisan make:model Flight --all
- php artisan make:request SignUpRequest
- php artisan make:mail SignUpMail
- php artisan make:job SendUserVarifyMail
- php artisan queue:table
- composer require laravel/passport
- php artisan passport:install
  
## Front-end packages
-  npm install bootstrap@latest // Not using
-  npm install -D tailwindcss
-  npx tailwindcss init
-  npm install @reduxjs/toolkit react-icons react-redux
-  npm i -D react-router-dom
-  npm i classnames
-  npm i prop-types

## importent facts
- validator error does not sends responce in api // at least I can't figure out yet
- to solve this problem I create a custom request class named *SignUpRequest*
