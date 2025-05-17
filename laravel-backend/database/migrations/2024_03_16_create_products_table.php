
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->float('price');
            $table->integer('stock')->default(0);
            $table->integer('minStock')->default(5);
            $table->string('categoryId');
            $table->string('brandId');
            $table->string('warehouse')->nullable();
            $table->string('taxClass')->nullable();
            $table->string('metaTitle')->nullable();
            $table->text('metaDescription')->nullable();
            $table->json('customFields')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
