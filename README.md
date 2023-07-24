# Get-Help
The deadline is 8 August 2023, so hurry up.

## Used commands
```
php artisan make:model Flight --all
php artisan make:request SignUpRequest
php artisan make:mail SignUpMail
php artisan make:job SendUserVarifyMail
php artisan queue:table
composer require laravel/passport
php artisan passport:install
```

- [ ] npm install bootstrap@latest // Not using
- [ ] npm install -D tailwindcss
- [ ] npx tailwindcss init
- [ ] npm install @reduxjs/toolkit react-icons react-redux
- [ ] npm i -D react-router-dom
- [ ] npm i classnames
- [ ] npm i react-query
=======
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
- To automate query, tagging system is the best way to go.

## Introducing roles & permission:
### Additional changes
- php artisan make:model Permission -mc
- php artisan make:model Role -mc
- php artisan make:migration create_users_permissions_table --create=permission_user
- php artisan make:migration create_users_roles_table --create=role_user
- php artisan make:migration create_roles_permissions_table --create=permission_role

### Testing roles and permissions using php artisan tinker:
#### Test - 1: Attach a role to a user
```php
$user = App\Models\User::findORFail(4);
$admin = App\Models\Role::findOrFail(3);
$user->roles()->attach($admin);
$view_all_users = App\Models\Permission::findOrFail(1);
$admin->permissions()->attach($view_all_users);
$admin->users; // array of users
$admin->permissions // array of permissions
```
=======
