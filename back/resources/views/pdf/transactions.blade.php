<!DOCTYPE html>
<html>
<head>
    <title>AtlasPay Sovereign Transaction Report</title>
    <style>
        @page {
            margin: 0;
        }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #1a1a1a; 
            line-height: 1.6; 
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .bg-strip {
            height: 15px;
            background: linear-gradient(90deg, #36694b 0%, #1a3a2a 100%);
        }
        .container {
            padding: 40px;
        }
        .header { 
            display: table;
            width: 100%;
            margin-bottom: 40px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        .header-cell {
            display: table-cell;
            vertical-align: bottom;
        }
        .logo { 
            color: #36694b; 
            font-size: 32px; 
            font-weight: 900; 
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        .logo span { color: #1a1a1a; font-style: italic; }
        
        .report-title {
            text-align: right;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #999;
        }

        .summary-box {
            background-color: #f8faf9;
            border: 1px solid #e9efeb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .summary-grid {
            display: table;
            width: 100%;
        }
        .summary-item {
            display: table-cell;
            width: 50%;
        }
        .label {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #36694b;
            margin-bottom: 5px;
        }
        .value {
            font-size: 14px;
            font-weight: bold;
            color: #1a1a1a;
        }

        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
        }
        th { 
            background-color: #1a1a1a; 
            color: white; 
            padding: 12px 15px; 
            text-align: left; 
            font-size: 9px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            font-weight: 900;
        }
        td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #f0f0f0; 
            font-size: 10px; 
            color: #444;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .amount { 
            font-weight: 900; 
            font-size: 11px;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
        }
        .status-completed { background-color: #e6f7f0; color: #10b981; }
        .status-pending { background-color: #fffbeb; color: #f59e0b; }
        .status-failed { background-color: #fef2f2; color: #ef4444; }

        .footer { 
            position: fixed;
            bottom: 30px;
            left: 40px;
            right: 40px;
            text-align: center; 
            font-size: 8px; 
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            font-weight: 900;
            color: #f0f0f0;
            z-index: -1;
            opacity: 0.5;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="bg-strip"></div>
    <div class="watermark">ATLASPAY</div>

    <div class="container">
        <div class="header">
            <div class="header-cell">
                <div class="logo">Atlas<span>Pay</span></div>
            </div>
            <div class="header-cell report-title">
                Sovereign Transaction Ledger<br>
                Ref: #{{ now()->format('Y-m-d') }}-{{ $user->id }}
            </div>
        </div>

        <div class="summary-box">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="label">Primary Beneficiary</div>
                    <div class="value">{{ $user->name }}</div>
                </div>
                <div class="summary-item" style="text-align: right;">
                    <div class="label">Date of Issuance</div>
                    <div class="value">{{ $date }}</div>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Ledger ID</th>
                    <th>Timestamp</th>
                    <th>Execution Method</th>
                    <th>Allocation</th>
                    <th style="text-align: right;">Net Amount (MAD)</th>
                    <th style="text-align: center;">Security Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $tx)
                <tr>
                    <td style="font-family: monospace;">#{{ str_pad($tx->id, 8, '0', STR_PAD_LEFT) }}</td>
                    <td>{{ $tx->created_at->format('M d, Y H:i') }}</td>
                    <td>{{ strtoupper(str_replace('_', ' ', $tx->method)) }}</td>
                    <td>
                        <span style="color: #666;">{{ strtoupper($tx->category ?: 'GENERAL') }}</span>
                    </td>
                    <td class="amount" style="text-align: right;">
                        <span style="color: {{ $tx->type === 'deposit' ? '#10b981' : '#1a1a1a' }}">
                            {{ $tx->type === 'deposit' ? '+' : '-' }}{{ number_format($tx->amount, 2) }}
                        </span>
                    </td>
                    <td style="text-align: center;">
                        <span class="status-badge status-{{ $tx->status }}">
                            {{ $tx->status }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            Official Financial Instrument • Sovereign Asset Management Network • AtlasPay Centralized Ledger
        </div>
    </div>
</body>
</html>
