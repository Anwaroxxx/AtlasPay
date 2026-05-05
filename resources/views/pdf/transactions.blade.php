<!DOCTYPE html>
<html>
<head>
    <title>AtlasPay Transaction Report</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #36694b; padding-bottom: 10px; }
        .logo { color: #36694b; font-size: 28px; font-weight: bold; text-transform: uppercase; }
        .info { margin-bottom: 20px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #36694b; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
        td { padding: 10px; border-bottom: 1px solid #eee; font-size: 11px; }
        .amount { font-weight: bold; }
        .deposit { color: #10b981; }
        .withdrawal { color: #ef4444; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">AtlasPay</div>
        <div style="font-size: 12px; color: #666;">Sovereign Banking Settlement Report</div>
    </div>

    <div class="info">
        <p><strong>Account Holder:</strong> {{ $user->name }}</p>
        <p><strong>Generated On:</strong> {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Method</th>
                <th>Category</th>
                <th>Amount (MAD)</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $tx)
            <tr>
                <td>#{{ str_pad($tx->id, 8, '0', STR_PAD_LEFT) }}</td>
                <td>{{ $tx->created_at->format('d/m/Y H:i') }}</td>
                <td>{{ strtoupper(str_replace('_', ' ', $tx->method)) }}</td>
                <td>{{ strtoupper($tx->category ?: 'GENERAL') }}</td>
                <td class="amount">
                    {{ number_format($tx->amount, 2) }}
                </td>
                <td>{{ strtoupper($tx->status) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        This document is an official record of the AtlasPay Sovereign Network. Encrypted and Verified.
    </div>
</body>
</html>
