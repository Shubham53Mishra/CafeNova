<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h1 class="text-xl font-bold mb-4">Login</h1>
            <form method="POST" action="{{ route('login') }}">
                @csrf
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" id="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                </div>
                <div class="flex items-center justify-between">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
                    <a href="{{ route('register') }}" class="text-sm text-blue-500">Sign up</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>