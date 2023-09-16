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
- [ ] npm i simple-peer
- [ ] npm i pusher-js
- [ ] npm install react-webcam

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
-  npm install moment
-  npm i socket.io-client
<!-- -  npm i quill -->
-  npm i quill highlight.js // not using
-  npm install react-quill --save
-  npm i draft-js react-draft-wysiwyg // not going to use
-  npm i emoji-mart // not going to use
-  backup dependency -// "draft-js": "^0.11.7",
    // "emoji-mart": "^5.5.2",    // "react-draft-wysiwyg": "^1.15.0",


## importent facts
- validator error does not sends responce in api // at least I can't figure out yet
- to solve this problem I create a custom request class named *SignUpRequest*
- To automate query, tagging system is the best way to go.
### React with Draft.js gives "Global is not defined" error
The best way to solve this is to add this codd to the index.html(for my case I added in header)
```js
<script>
    const global = globalThis;
</script>
```

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

## Node package
- npm i socket.io