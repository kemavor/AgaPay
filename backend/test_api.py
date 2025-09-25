import requests
import json
import time

def test_backend():
    """Test backend API endpoints"""
    base_url = "http://localhost:8000"

    print("🧪 Testing AgaPay Backend API")
    print("=" * 40)

    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health Check: PASS")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health Check: FAIL ({response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ Health Check: FAIL ({e})")

    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Root Endpoint: PASS")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root Endpoint: FAIL ({response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ Root Endpoint: FAIL ({e})")

    # Test API docs endpoint
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API Documentation: PASS")
        else:
            print(f"❌ API Documentation: FAIL ({response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ API Documentation: FAIL ({e})")

    print("\n🔗 Available Endpoints:")
    print("   - GET  /              - API Info")
    print("   - GET  /health        - Health Check")
    print("   - GET  /docs          - Swagger UI")
    print("   - POST /api/auth/register - User Registration")
    print("   - POST /api/auth/login    - User Login")
    print("   - POST /api/payments/initialize - Initialize Payment")
    print("   - POST /api/payments/mobile-money - Mobile Money Payment")
    print("   - GET  /api/payments/verify/{reference} - Verify Payment")

if __name__ == "__main__":
    test_backend()