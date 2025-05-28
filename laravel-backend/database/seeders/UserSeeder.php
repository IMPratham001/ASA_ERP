<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Pratham', // 👈 Change as needed
            'email' => 'sonipratham415@gmail.com', // 👈 Your login email
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('Admin@123'), // 👈 Your login password
            'remember_token' => Str::random(10),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'company_id' => null,
        ]);
    }
}
