
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('role')->default('user');
            $table->timestamps();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('location');
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('details_status')->default('pending_details');
            $table->string('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->json('required_fields')->nullable();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('parent_id')->nullable();
            $table->timestamps();
            $table->foreign('parent_id')->references('id')->on('categories');
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('stores');
        Schema::dropIfExists('users');
    }
};
