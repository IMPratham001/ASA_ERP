
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: 'Noto Sans', sans-serif; }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            opacity: 0.2;
            z-index: -1;
        }
        .header { text-align: center; }
        .qr-code { position: absolute; top: 10px; right: 10px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; }
    </style>
</head>
<body>
    @if($watermark)
        <div class="watermark">{{ $watermark }}</div>
    @endif

    <div class="header">
        <img src="{{ public_path('logo.png') }}" height="50">
        <h1>Invoice #{{ $invoice->id }}</h1>
    </div>

    <div class="qr-code">
        <img src="data:image/png;base64,{{ $qrCode }}">
    </div>

    <!-- Invoice Details -->
    <div class="content">
        <h2>Customer Details</h2>
        <p>{{ $invoice->customer->name }}</p>
        <p>{{ $invoice->customer->email }}</p>

        <h2>Items</h2>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price, 2) }}</td>
                    <td>${{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <h2>Total: ${{ number_format($invoice->total, 2) }}</h2>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
    </div>
</body>
</html>
