<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo App</title>
</head>

<body>
    <div style="font-family: sans-serif;">
        <h1>Congratulations {{ $mailData['name'] }}!!</h1>
        <p>You have successfully created an account. Varify account by putting code <a
                href="{{ $mailData['link'] }}">here</a></p>
    </div>

    <div style="text-align: center; font-family: sans-serif;">
        <h2>Varification Code</h2>
        <h4>{{ $mailData['sixDigitNumber'] }}</h4>
    </div>


</body>

</html>
