
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('work_phone')->nullable();
            $table->string('mobile')->nullable();
            $table->text('address')->nullable();
            $table->text('billing_address')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('website')->nullable();
            $table->enum('customer_type', ['business', 'individual'])->default('business');
            $table->string('company_name')->nullable();
            $table->string('primary_contact')->nullable();
            $table->string('salutation')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('currency')->default('USD');
            $table->string('payment_terms')->nullable();
            $table->string('portal_language')->default('en');
            $table->boolean('portal_access')->default(false);
            $table->string('status')->default('active');
            $table->text('remarks')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('fax')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
};
