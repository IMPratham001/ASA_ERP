
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { 
            font-family: 'Noto Sans', sans-serif;
            margin: 0;
            padding: 20px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            opacity: 0.2;
            z-index: -1;
            color: #888;
        }
        .header { 
            text-align: center;
            margin-bottom: 30px;
        }
        .qr-code { 
            position: absolute;
            top: 10px;
            right: 10px;
            width: 100px;
            height: 100px;
        }
        .invoice-info {
            margin-bottom: 20px;
        }
        .customer-details {
            margin-bottom: 30px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .items-table th {
            background-color: #f8f9fa;
        }
        .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
        }
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

    <div class="invoice-info">
        <p><strong>Date:</strong> {{ $invoice->created_at->format('Y-m-d') }}</p>
        <p><strong>Due Date:</strong> {{ $invoice->due_date->format('Y-m-d') }}</p>
    </div>

    <div class="customer-details">
        <h2>Customer Details</h2>
        <p>{{ $invoice->customer->name }}</p>
        <p>{{ $invoice->customer->email }}</p>
        <p>{{ $invoice->customer->address }}</p>
    </div>

    <table class="items-table">
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

    <div class="total">
        <p>Subtotal: ${{ number_format($invoice->subtotal, 2) }}</p>
        <p>Tax ({{ $invoice->tax_rate }}%): ${{ number_format($invoice->tax_amount, 2) }}</p>
        <h2>Total: ${{ number_format($invoice->total, 2) }}</h2>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
    </div>
</body>
</html>
