
Route::get('/dashboard/stats', [App\Http\Controllers\API\DashboardController::class, 'getStats']);
Route::get('/test', [App\Http\Controllers\API\TestController::class, 'test']);
