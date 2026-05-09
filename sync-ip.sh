#!/bin/bash

# 1. Detect the Windows Host IP (The one your phone can actually see)
# We look for the IP starting with 192.168. from ipconfig.exe
# We exclude common virtual IPs (like 172.x or 192.168.144.x/192.168.156.x which are usually WSL/vEthernet)
WIN_IP=$(ipconfig.exe | grep "IPv4 Address" | grep "192.168." | grep -v "192.168.144." | grep -v "192.168.156." | awk -F': ' '{print $2}' | tr -d '\r' | head -n 1)

# Fallback to WSL IP if Windows IP not found
if [ -z "$WIN_IP" ]; then
    WIN_IP=$(hostname -I | awk '{print $1}')
fi

if [ -z "$WIN_IP" ]; then
    echo "Error: Could not detect any valid IP address."
    exit 1
fi

echo "Target IP for configuration: $WIN_IP"

# Path to .env file
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found."
    exit 1
fi

# 2. Update .env values
# Update APP_URL
sed -i "s|APP_URL=http://[^:/]*|APP_URL=http://$WIN_IP|g" "$ENV_FILE"
# Update REVERB_HOST
sed -i "s|REVERB_HOST=.*|REVERB_HOST=\"$WIN_IP\"|g" "$ENV_FILE"

echo "Updated .env with IP: $WIN_IP"

# 3. Update vite.config.ts HMR host
VITE_CONFIG="vite.config.ts"
if [ -f "$VITE_CONFIG" ]; then
    # Update the hmr: { host: '...' } part
    sed -i "s|host: '192\.168\.[0-9]\{1,3\}\.[0-9]\{1,3\}'|host: '$WIN_IP'|g" "$VITE_CONFIG"
    echo "Updated vite.config.ts HMR host to: $WIN_IP"
fi

echo "-------------------------------------------------------"
echo "Done! To make your phone connect successfully:"
echo ""
echo "1. Run Laravel on 0.0.0.0 (listens everywhere):"
echo "   php artisan serve --host=0.0.0.0"
echo ""
echo "2. Run Vite (already configured to listen everywhere):"
echo "   npm run dev"
echo ""
echo "3. Access on your phone or computer using:"
echo "   http://$WIN_IP:8000"
echo "-------------------------------------------------------"
