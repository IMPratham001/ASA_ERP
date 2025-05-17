
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('url');
            $table->string('alt')->nullable();
            $table->integer('order')->default(0);
            $table->string('productId');
            $table->foreign('productId')->references('id')->on('products');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};
