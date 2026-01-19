// Route for Login page
Route::get('/login', function () {
    return view('auth.login');
});

// Route for Signup page
Route::get('/signup', function () {
    return view('auth.signup');
});