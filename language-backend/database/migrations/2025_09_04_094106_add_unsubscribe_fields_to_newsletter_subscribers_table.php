<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->timestamp('unsubscribed_at')->nullable()->after('subscribed_at');
            $table->text('unsubscribe_reason')->nullable()->after('unsubscribed_at');
        });
    }

    public function down()
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['unsubscribed_at', 'unsubscribe_reason']);
        });
    }
};